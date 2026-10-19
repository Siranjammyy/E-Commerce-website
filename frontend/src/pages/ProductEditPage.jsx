import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Save } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { listProductDetails, updateProduct } from '../actions/productActions';
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants';
import Message from '../components/Message';
import Loader from '../components/Loader';

const ProductEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const productUpdate = useSelector((state) => state.productUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login');
      return;
    }

    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      navigate('/admin/productlist');
    }
  }, [navigate, successUpdate, userInfo, dispatch]);

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      if (!product || !product.name || product._id !== id) {
        dispatch(listProductDetails(id));
      }
    }
  }, [dispatch, id, product, userInfo]);

  const [loadedId, setLoadedId] = useState(null);

  if (product && product._id === id && loadedId !== id) {
    setLoadedId(id);
    setName(product.name || '');
    setPrice(product.price !== undefined ? product.price : 0);
    setImage(product.image || '');
    setBrand(product.brand || '');
    setCategory(product.category || '');
    setCountInStock(product.countInStock !== undefined ? product.countInStock : 0);
    setDescription(product.description || '');
  }

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateProduct({
        _id: id,
        name,
        price: Number(price),
        image,
        brand,
        category,
        description,
        countInStock: Number(countInStock),
      })
    );
  };

  return (
    <AdminLayout
      title="Artifact Specification Editor"
      subtitle={`Fine-tune specifications, inventory allotments, and pricing for artifact #${id.slice(-6).toUpperCase()}.`}
      actions={
        <Link
          to="/admin/productlist"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-charcoal/60 hover:text-charcoal transition border border-sand px-4 py-2.5 bg-white"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Inventory</span>
        </Link>
      }
    >
      <div className="max-w-3xl">
        <div className="bg-white border border-sand/60 p-8 sm:p-10 shadow-sm">
          {loadingUpdate && <Loader size="sm" text="Recording updates to database..." />}
          {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}

          {loading ? (
            <div className="py-12">
              <Loader text="Retrieving artifact..." />
            </div>
          ) : error ? (
            <Message variant="danger">{error}</Message>
          ) : (
            <form onSubmit={submitHandler} className="space-y-6">
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-charcoal/70 mb-2 font-medium">
                  Artifact Title *
                </label>
                <input
                  type="text"
                  className="w-full bg-ivory/40 border border-sand px-4 py-3 text-xs sm:text-sm text-charcoal focus:outline-none focus:border-charcoal focus:bg-white transition"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-charcoal/70 mb-2 font-medium">
                    Price (USD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full bg-ivory/40 border border-sand px-4 py-3 text-xs sm:text-sm text-charcoal focus:outline-none focus:border-charcoal focus:bg-white transition"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-charcoal/70 mb-2 font-medium">
                    Stock Allocation Units *
                  </label>
                  <input
                    type="number"
                    className="w-full bg-ivory/40 border border-sand px-4 py-3 text-xs sm:text-sm text-charcoal focus:outline-none focus:border-charcoal focus:bg-white transition"
                    value={countInStock}
                    onChange={(e) => setCountInStock(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-widest text-charcoal/70 mb-2 font-medium">
                  Image URL / Asset Reference *
                </label>
                <input
                  type="text"
                  className="w-full bg-ivory/40 border border-sand px-4 py-3 text-xs sm:text-sm text-charcoal focus:outline-none focus:border-charcoal focus:bg-white transition"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  required
                />
                {image && (
                  <div className="mt-3 flex items-center gap-3 p-3 bg-ivory/60 border border-sand/60">
                    <div className="w-12 h-12 bg-white border border-sand flex items-center justify-center p-1 shrink-0">
                      <img
                        src={image}
                        alt="Preview"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <span className="text-[11px] text-charcoal/60">
                      Live image preview verified
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-charcoal/70 mb-2 font-medium">
                    Brand / Manufacturer *
                  </label>
                  <input
                    type="text"
                    className="w-full bg-ivory/40 border border-sand px-4 py-3 text-xs sm:text-sm text-charcoal focus:outline-none focus:border-charcoal focus:bg-white transition"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-charcoal/70 mb-2 font-medium">
                    Department Category *
                  </label>
                  <input
                    type="text"
                    className="w-full bg-ivory/40 border border-sand px-4 py-3 text-xs sm:text-sm text-charcoal focus:outline-none focus:border-charcoal focus:bg-white transition"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-widest text-charcoal/70 mb-2 font-medium">
                  Technical Specifications & Notes *
                </label>
                <textarea
                  rows="4"
                  className="w-full bg-ivory/40 border border-sand px-4 py-3 text-xs sm:text-sm text-charcoal focus:outline-none focus:border-charcoal focus:bg-white transition leading-relaxed"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loadingUpdate}
                  className="w-full bg-charcoal hover:bg-olive text-ivory text-xs uppercase tracking-[0.2em] py-4 font-medium transition duration-300 flex items-center justify-center gap-2 shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{loadingUpdate ? 'Saving Updates...' : 'Commit Record Changes'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProductEditPage;
