import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Search, AlertTriangle } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { listProducts, deleteProduct, createProduct } from '../actions/productActions';
import { PRODUCT_CREATE_RESET } from '../constants/productConstants';
import Message from '../components/Message';
import Loader from '../components/Loader';

const ProductListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [deleteCandidate, setDeleteCandidate] = useState(null);

  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

  const productDelete = useSelector((state) => state.productDelete);
  const { loading: loadingDelete, error: errorDelete, success: successDelete } = productDelete;

  const productCreate = useSelector((state) => state.productCreate);
  const { loading: loadingCreate, error: errorCreate, success: successCreate, product: createdProduct } = productCreate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET });

    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login');
      return;
    }

    if (successCreate) {
      navigate(`/admin/product/${createdProduct._id}/edit`);
    } else {
      dispatch(listProducts());
    }
  }, [dispatch, navigate, userInfo, successDelete, successCreate, createdProduct]);

  const confirmDelete = () => {
    if (deleteCandidate) {
      dispatch(deleteProduct(deleteCandidate._id));
      setDeleteCandidate(null);
    }
  };

  const createProductHandler = () => {
    dispatch(createProduct());
  };

  // Filtered products list
  const filteredProducts = (products || []).filter((prod) => {
    const matchesSearch =
      prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat =
      selectedCategory === 'all' || prod.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const categories = ['all', 'Electronics', 'Audio', 'Cameras', 'Gaming', 'Accessories'];

  return (
    <AdminLayout
      title="Catalog Inventory"
      subtitle="Oversee artifact specifications, unit costs, imagery, and stock allocation thresholds."
      actions={
        <button
          onClick={createProductHandler}
          disabled={loadingCreate}
          className="bg-charcoal hover:bg-olive text-ivory text-xs uppercase tracking-[0.2em] px-5 py-3 font-medium transition duration-300 flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{loadingCreate ? 'Creating...' : 'New Artifact'}</span>
        </button>
      }
    >
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}
      {errorCreate && <Message variant="danger">{errorCreate}</Message>}
      {loadingDelete && <Loader size="sm" text="Removing artifact from catalog..." />}

      {/* Filter and Search Bar */}
      <div className="bg-white border border-sand/60 p-4 mb-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search artifacts or brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-ivory/40 border border-sand pl-9 pr-4 py-2 text-xs text-charcoal focus:outline-none focus:border-charcoal focus:bg-white transition"
          />
          <Search className="w-3.5 h-3.5 text-charcoal/40 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <span className="text-[10px] uppercase tracking-wider text-charcoal/40 mr-1 shrink-0">
            Department:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-2.5 py-1 transition uppercase tracking-wider font-medium ${
                selectedCategory === cat
                  ? 'bg-charcoal text-ivory border border-charcoal'
                  : 'bg-white text-charcoal/70 border border-sand hover:border-charcoal'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-20">
          <Loader text="Loading catalog from database..." />
        </div>
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div className="bg-white border border-sand/60 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-sand/60 bg-ivory/50 text-[10px] uppercase tracking-widest text-charcoal/60">
                  <th className="py-3.5 px-4 font-medium">Artifact</th>
                  <th className="py-3.5 px-4 font-medium">Price</th>
                  <th className="py-3.5 px-4 font-medium">Department</th>
                  <th className="py-3.5 px-4 font-medium">Brand</th>
                  <th className="py-3.5 px-4 font-medium">Available Units</th>
                  <th className="py-3.5 px-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand/40">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-charcoal/50 text-xs">
                      No matching artifacts found for current search/filter.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((prod) => (
                    <tr key={prod._id} className="hover:bg-sand/10 transition">
                      <td className="py-3.5 px-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-sand/15 border border-sand/40 shrink-0 flex items-center justify-center p-1">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="max-h-full max-w-full object-contain"
                            onError={(e) => {
                              const fallback = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80';
                              if (e.target.src !== fallback) {
                                e.target.src = fallback;
                              }
                            }}
                          />
                        </div>
                        <span className="font-serif text-sm text-charcoal font-medium truncate max-w-xs block">
                          {prod.name}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-charcoal">
                        ${Number(prod.price).toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-charcoal/70">
                        {prod.category}
                      </td>
                      <td className="py-3.5 px-4 text-charcoal/70">
                        {prod.brand}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`font-mono font-medium text-xs ${
                            prod.countInStock > 0 ? 'text-olive' : 'text-red-700'
                          }`}
                        >
                          {prod.countInStock} {prod.countInStock === 1 ? 'unit' : 'units'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            to={`/admin/product/${prod._id}/edit`}
                            className="border border-sand hover:border-charcoal text-charcoal text-[11px] uppercase tracking-wider px-2.5 py-1 transition"
                            title="Edit Artifact"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => setDeleteCandidate(prod)}
                            className="border border-red-200 text-red-700 hover:bg-red-50 text-[11px] uppercase tracking-wider px-2.5 py-1 transition"
                            title="Delete Artifact"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Destructive Delete */}
      {deleteCandidate && (
        <div className="fixed inset-0 bg-charcoal/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-sand p-6 sm:p-8 max-w-md w-full shadow-lg">
            <div className="flex items-center gap-3 text-red-700 mb-3">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="font-serif text-xl text-charcoal font-medium">
                Confirm Artifact Deletion
              </h3>
            </div>
            <p className="text-xs text-charcoal/70 leading-relaxed mb-6 font-light">
              Are you certain you wish to permanently remove &ldquo;{deleteCandidate.name}&rdquo; from the store catalog? This action will purge the product record from the database.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteCandidate(null)}
                className="border border-sand hover:border-charcoal px-4 py-2 text-xs uppercase tracking-wider text-charcoal transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-700 hover:bg-red-800 text-white px-5 py-2 text-xs uppercase tracking-wider transition"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ProductListPage;
