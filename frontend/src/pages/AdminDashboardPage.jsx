import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Package,
  ShoppingBag,
  Users,
  DollarSign,
  ArrowRight,
  Clock,
  CheckCircle2,
  Plus,
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { listProducts, createProduct } from '../actions/productActions';
import { listOrders } from '../actions/orderActions';
import { listUsers } from '../actions/userActions';
import { PRODUCT_CREATE_RESET } from '../constants/productConstants';
import Loader from '../components/Loader';
import Message from '../components/Message';

const AdminDashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const productList = useSelector((state) => state.productList);
  const { products } = productList;

  const orderList = useSelector((state) => state.orderList);
  const { orders, loading: loadingOrders, error: errorOrders } = orderList;

  const userList = useSelector((state) => state.userList);
  const { users } = userList;

  const productCreate = useSelector((state) => state.productCreate);
  const { loading: loadingCreate, success: successCreate, product: createdProduct } = productCreate;

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
      dispatch(listOrders());
      dispatch(listUsers());
    }
  }, [dispatch, navigate, userInfo, successCreate, createdProduct]);

  // Aggregate metrics
  const totalProducts = products?.length || 0;
  const totalOrders = orders?.length || 0;
  const totalUsers = users?.length || 0;

  const totalRevenue = orders
    ? orders
        .filter((o) => o.isPaid)
        .reduce((acc, o) => acc + (o.totalPrice || 0), 0)
    : 0;

  const pendingDeliveries = orders
    ? orders.filter((o) => o.isPaid && !o.isDelivered).length
    : 0;

  const lowStockProducts = products
    ? products.filter((p) => p.countInStock <= 3)
    : [];

  const handleCreateProduct = () => {
    dispatch(createProduct());
  };

  return (
    <AdminLayout
      title="Executive Overview"
      subtitle="Comprehensive metrics across store inventory, transaction ledgers, and patron directory."
      actions={
        <button
          onClick={handleCreateProduct}
          disabled={loadingCreate}
          className="bg-charcoal hover:bg-olive text-ivory text-xs uppercase tracking-[0.2em] px-5 py-3 font-medium transition duration-300 flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{loadingCreate ? 'Creating...' : 'Commission Artifact'}</span>
        </button>
      }
    >
      {/* 1. Key Performance Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
        {/* Metric 1: Realized Settlement Volume */}
        <div className="bg-white border border-sand/60 p-6 shadow-sm">
          <div className="flex items-center justify-between text-charcoal/50 mb-2">
            <span className="text-[10px] uppercase tracking-widest font-semibold">
              Realized Revenue
            </span>
            <DollarSign className="w-4 h-4 text-olive" />
          </div>
          <p className="font-mono text-2xl sm:text-3xl text-charcoal font-medium">
            ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <span className="text-[11px] text-olive font-medium mt-1 block">
            Verified backend settlement
          </span>
        </div>

        {/* Metric 2: Total Orders */}
        <div className="bg-white border border-sand/60 p-6 shadow-sm">
          <div className="flex items-center justify-between text-charcoal/50 mb-2">
            <span className="text-[10px] uppercase tracking-widest font-semibold">
              Order Transactions
            </span>
            <ShoppingBag className="w-4 h-4 text-olive" />
          </div>
          <p className="font-mono text-2xl sm:text-3xl text-charcoal font-medium">
            {totalOrders}
          </p>
          <span className="text-[11px] text-charcoal/60 mt-1 block">
            {pendingDeliveries} awaiting courier dispatch
          </span>
        </div>

        {/* Metric 3: Active Catalog Items */}
        <div className="bg-white border border-sand/60 p-6 shadow-sm">
          <div className="flex items-center justify-between text-charcoal/50 mb-2">
            <span className="text-[10px] uppercase tracking-widest font-semibold">
              Catalog Artifacts
            </span>
            <Package className="w-4 h-4 text-olive" />
          </div>
          <p className="font-mono text-2xl sm:text-3xl text-charcoal font-medium">
            {totalProducts}
          </p>
          <span className="text-[11px] text-charcoal/60 mt-1 block">
            {lowStockProducts.length} low stock alerts
          </span>
        </div>

        {/* Metric 4: Registered Patrons */}
        <div className="bg-white border border-sand/60 p-6 shadow-sm">
          <div className="flex items-center justify-between text-charcoal/50 mb-2">
            <span className="text-[10px] uppercase tracking-widest font-semibold">
              Member Directory
            </span>
            <Users className="w-4 h-4 text-olive" />
          </div>
          <p className="font-mono text-2xl sm:text-3xl text-charcoal font-medium">
            {totalUsers}
          </p>
          <span className="text-[11px] text-charcoal/60 mt-1 block">
            Registered customer accounts
          </span>
        </div>
      </div>

      {/* 2. Middle Row: Low Stock Alerts + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10 items-start">
        {/* Low Stock Alerts */}
        <div className="lg:col-span-8 bg-white border border-sand/60 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-sand/40">
            <div className="flex items-center gap-2">
              <span className="w-3 h-px bg-olive"></span>
              <h2 className="font-serif text-xl text-charcoal font-normal">
                Inventory Allocation Monitoring
              </h2>
            </div>
            <Link
              to="/admin/productlist"
              className="text-xs uppercase tracking-wider text-charcoal/60 hover:text-charcoal underline"
            >
              Full Inventory &rarr;
            </Link>
          </div>

          {lowStockProducts.length === 0 ? (
            <p className="text-xs text-charcoal/60 py-4 font-light">
              All inventory levels are currently above reorder thresholds.
            </p>
          ) : (
            <div className="divide-y divide-sand/40">
              {lowStockProducts.map((prod) => (
                <div
                  key={prod._id}
                  className="py-3 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-sand/15 border border-sand/40 flex items-center justify-center p-1 shrink-0">
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
                    <div>
                      <span className="font-serif text-sm text-charcoal font-medium block">
                        {prod.name}
                      </span>
                      <span className="text-[11px] text-charcoal/50">
                        {prod.brand} &bull; {prod.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`text-xs font-mono font-medium ${
                        prod.countInStock === 0 ? 'text-red-700' : 'text-amber-700'
                      }`}
                    >
                      {prod.countInStock === 0
                        ? 'Sold Out (0)'
                        : `${prod.countInStock} Left`}
                    </span>
                    <Link
                      to={`/admin/product/${prod._id}/edit`}
                      className="border border-sand hover:border-charcoal text-charcoal text-[11px] uppercase tracking-wider px-2.5 py-1 transition"
                    >
                      Restock
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Backoffice Shortcuts */}
        <div className="lg:col-span-4 bg-white border border-sand/60 p-6 sm:p-8 shadow-sm">
          <div className="pb-4 mb-4 border-b border-sand/40">
            <h2 className="font-serif text-xl text-charcoal font-normal">
              Direct Procedures
            </h2>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleCreateProduct}
              className="w-full text-left p-3 border border-sand hover:border-charcoal bg-ivory/30 hover:bg-white transition flex items-center justify-between"
            >
              <div>
                <span className="text-xs uppercase tracking-wider font-medium text-charcoal block">
                  Commission New Artifact
                </span>
                <span className="text-[11px] text-charcoal/60">
                  Register new electronics in catalog
                </span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-olive shrink-0" />
            </button>

            <Link
              to="/admin/orderlist"
              className="w-full text-left p-3 border border-sand hover:border-charcoal bg-ivory/30 hover:bg-white transition flex items-center justify-between block"
            >
              <div>
                <span className="text-xs uppercase tracking-wider font-medium text-charcoal block">
                  Verify Courier Dispatches
                </span>
                <span className="text-[11px] text-charcoal/60">
                  Mark handed-over shipments as delivered
                </span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-olive shrink-0" />
            </Link>

            <Link
              to="/admin/userlist"
              className="w-full text-left p-3 border border-sand hover:border-charcoal bg-ivory/30 hover:bg-white transition flex items-center justify-between block"
            >
              <div>
                <span className="text-xs uppercase tracking-wider font-medium text-charcoal block">
                  Inspect Patron Directory
                </span>
                <span className="text-[11px] text-charcoal/60">
                  Review permissions and administrator roles
                </span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-olive shrink-0" />
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Recent Transactions Ledger */}
      <div className="bg-white border border-sand/60 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-sand/40">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-olive font-semibold block mb-1">
              Active Transactions
            </span>
            <h2 className="font-serif text-xl sm:text-2xl text-charcoal font-normal">
              Recent Order Ledger
            </h2>
          </div>
          <Link
            to="/admin/orderlist"
            className="text-xs uppercase tracking-wider text-charcoal/60 hover:text-charcoal underline"
          >
            Inspect All Orders &rarr;
          </Link>
        </div>

        {loadingOrders ? (
          <div className="py-12">
            <Loader text="Loading ledger..." />
          </div>
        ) : errorOrders ? (
          <Message variant="danger">{errorOrders}</Message>
        ) : orders && orders.length === 0 ? (
          <p className="text-xs text-charcoal/60 py-6">No orders recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-sand/60 bg-ivory/50 text-[10px] uppercase tracking-widest text-charcoal/60">
                  <th className="py-3 px-4 font-medium">Reference</th>
                  <th className="py-3 px-4 font-medium">Client</th>
                  <th className="py-3 px-4 font-medium">Date</th>
                  <th className="py-3 px-4 font-medium">Amount</th>
                  <th className="py-3 px-4 font-medium">Settlement</th>
                  <th className="py-3 px-4 font-medium">Logistics</th>
                  <th className="py-3 px-4 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand/40">
                {orders.slice(0, 5).map((ord) => (
                  <tr key={ord._id} className="hover:bg-sand/10 transition">
                    <td className="py-3.5 px-4 font-mono font-medium text-charcoal">
                      #{ord._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      <span className="font-medium text-charcoal block">
                        {ord.user ? ord.user.name : 'Unknown User'}
                      </span>
                      <span className="text-[10px] text-charcoal/50 font-mono">
                        {ord.user ? ord.user.email : ''}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-charcoal/70">
                      {new Date(ord.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-charcoal">
                      ${Number(ord.totalPrice).toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4">
                      {ord.isPaid ? (
                        <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-emerald-800 font-medium">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Settled</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-amber-800 font-medium">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>Pending</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {ord.isDelivered ? (
                        <span className="text-[10px] uppercase tracking-wider text-emerald-800 font-medium">
                          Delivered
                        </span>
                      ) : (
                        <span className="text-[10px] uppercase tracking-wider text-charcoal/60 font-medium">
                          Processing
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/order/${ord._id}`}
                        className="border border-sand hover:border-charcoal text-charcoal text-[11px] uppercase tracking-wider px-3 py-1 font-medium transition"
                      >
                        Receipt
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
