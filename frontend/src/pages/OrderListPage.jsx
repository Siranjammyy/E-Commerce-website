import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircle2, Clock, Search } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { listOrders } from '../actions/orderActions';
import Message from '../components/Message';
import Loader from '../components/Loader';

const OrderListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [deliveryFilter, setDeliveryFilter] = useState('all');

  const orderList = useSelector((state) => state.orderList);
  const { loading, error, orders } = orderList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listOrders());
    } else {
      navigate('/login');
    }
  }, [dispatch, navigate, userInfo]);

  // Filter orders
  const filteredOrders = (orders || []).filter((ord) => {
    const refMatch = ord._id.toLowerCase().includes(searchTerm.toLowerCase());
    const clientMatch = ord.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSearch = !searchTerm || refMatch || clientMatch;

    const matchesPayment =
      paymentFilter === 'all' ||
      (paymentFilter === 'paid' && ord.isPaid) ||
      (paymentFilter === 'unpaid' && !ord.isPaid);

    const matchesDelivery =
      deliveryFilter === 'all' ||
      (deliveryFilter === 'delivered' && ord.isDelivered) ||
      (deliveryFilter === 'pending' && !ord.isDelivered);

    return matchesSearch && matchesPayment && matchesDelivery;
  });

  return (
    <AdminLayout
      title="Transactions & Fulfillment"
      subtitle="Audit customer acquisitions, verify electronic settlements, and confirm courier dispatches."
    >
      {/* Search & Filter Toolbar */}
      <div className="bg-white border border-sand/60 p-4 mb-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search by client name, email, or order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-ivory/40 border border-sand pl-9 pr-4 py-2 text-xs text-charcoal focus:outline-none focus:border-charcoal focus:bg-white transition"
          />
          <Search className="w-3.5 h-3.5 text-charcoal/40 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Filter Selectors */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Payment Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[10px] uppercase tracking-wider text-charcoal/50">Settlement:</span>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="bg-white border border-sand px-2 py-1 text-xs text-charcoal focus:outline-none focus:border-charcoal"
            >
              <option value="all">All Transactions</option>
              <option value="paid">Settled Only</option>
              <option value="unpaid">Pending Only</option>
            </select>
          </div>

          {/* Delivery Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[10px] uppercase tracking-wider text-charcoal/50">Logistics:</span>
            <select
              value={deliveryFilter}
              onChange={(e) => setDeliveryFilter(e.target.value)}
              className="bg-white border border-sand px-2 py-1 text-xs text-charcoal focus:outline-none focus:border-charcoal"
            >
              <option value="all">All Dispatches</option>
              <option value="delivered">Delivered</option>
              <option value="pending">In Processing</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-20">
          <Loader text="Loading orders ledger from database..." />
        </div>
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div className="bg-white border border-sand/60 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-sand/60 bg-ivory/50 text-[10px] uppercase tracking-widest text-charcoal/60">
                  <th className="py-3.5 px-4 font-medium">Order Reference</th>
                  <th className="py-3.5 px-4 font-medium">Client</th>
                  <th className="py-3.5 px-4 font-medium">Date</th>
                  <th className="py-3.5 px-4 font-medium">Balance</th>
                  <th className="py-3.5 px-4 font-medium">Settlement</th>
                  <th className="py-3.5 px-4 font-medium">Courier</th>
                  <th className="py-3.5 px-4 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand/40">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-charcoal/50 text-xs">
                      No transactions match the selected criteria.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord) => (
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
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-charcoal">
                        ${Number(ord.totalPrice).toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4">
                        {ord.isPaid ? (
                          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-emerald-800 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Settled</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-amber-800 font-medium">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
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
                          Inspect
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default OrderListPage;
