import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  CreditCard,
  CheckCircle2,
  Clock,
  Truck,
  ShieldCheck,
  ArrowLeft,
} from 'lucide-react';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { getOrderDetails, payOrder, deliverOrder } from '../actions/orderActions';
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from '../constants/orderConstants';

const OrderPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }

    if (!order || order._id !== id || successPay || successDeliver) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(getOrderDetails(id));
    }
  }, [dispatch, id, successPay, successDeliver, order, userInfo, navigate]);

  const successPaymentHandler = () => {
    dispatch(
      payOrder(id, {
        id: `SETTLED_${Date.now()}`,
        status: 'COMPLETED',
        update_time: new Date().toISOString(),
        email_address: userInfo.email,
      })
    );
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };

  return (
    <div className="bg-canvas min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="py-24">
            <Loader text="Retrieving verified order ledger from database..." />
          </div>
        ) : error ? (
          <div className="max-w-2xl mx-auto py-12">
            <Message variant="danger">{error}</Message>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-charcoal/60 hover:text-charcoal mt-4"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Catalog</span>
            </Link>
          </div>
        ) : order ? (
          <div>
            {/* Header Strip */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 mb-8 border-b border-sand/60 gap-4">
              <div>
                <div className="inline-flex items-center gap-2 mb-1.5">
                  <span className="w-4 h-px bg-olive"></span>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-olive font-semibold">
                    Official Ledger Receipt
                  </span>
                </div>
                <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal">
                  Order Reference #{order._id}
                </h1>
                <p className="text-xs text-charcoal/60 mt-1 font-light">
                  Recorded on{' '}
                  {new Date(order.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              <Link
                to="/profile"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-charcoal/60 hover:text-charcoal transition"
              >
                <span>View All Orders &rarr;</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left Column: Courier, Settlement, and Artifacts */}
              <div className="lg:col-span-8 space-y-6">
                {/* Courier Dispatch Status */}
                <div className="bg-white border border-sand/60 p-6 sm:p-8 shadow-sm">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-sand/40">
                    <span className="text-[10px] uppercase tracking-widest text-olive font-semibold">
                      Courier & Logistics
                    </span>
                    <span
                      className={`text-[10px] uppercase tracking-widest px-2.5 py-0.5 border ${
                        order.isDelivered
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                          : 'border-sand bg-ivory text-charcoal/70'
                      }`}
                    >
                      {order.isDelivered ? 'Handover Confirmed' : 'In Processing'}
                    </span>
                  </div>

                  <p className="font-serif text-lg text-charcoal mb-1">
                    {order.user?.name}
                  </p>
                  <p className="text-xs text-charcoal/70 font-light">
                    {order.shippingAddress?.address}, {order.shippingAddress?.city},{' '}
                    {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
                  </p>
                  <p className="text-[11px] text-charcoal/50 font-mono mt-1">
                    Consignee Contact: {order.user?.email}
                  </p>

                  <div className="mt-5 pt-4 border-t border-sand/40">
                    {order.isDelivered ? (
                      <p className="text-xs text-emerald-800 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>
                          Delivered on{' '}
                          {new Date(order.deliveredAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </p>
                    ) : (
                      <p className="text-xs text-charcoal/60 flex items-center gap-2 font-light">
                        <Clock className="w-4 h-4 text-olive" />
                        <span>Awaiting dispatch allocation from central warehouse.</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Settlement Status */}
                <div className="bg-white border border-sand/60 p-6 sm:p-8 shadow-sm">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-sand/40">
                    <span className="text-[10px] uppercase tracking-widest text-olive font-semibold">
                      Payment Settlement
                    </span>
                    <span
                      className={`text-[10px] uppercase tracking-widest px-2.5 py-0.5 border ${
                        order.isPaid
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                          : 'border-amber-300 bg-amber-50 text-amber-800'
                      }`}
                    >
                      {order.isPaid ? 'Settled & Verified' : 'Pending Authorization'}
                    </span>
                  </div>

                  <p className="font-serif text-lg text-charcoal mb-1">
                    Instrument: {order.paymentMethod}
                  </p>

                  <div className="mt-4 pt-4 border-t border-sand/40">
                    {order.isPaid ? (
                      <p className="text-xs text-emerald-800 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>
                          Settled on{' '}
                          {new Date(order.paidAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}{' '}
                          &bull; Txn #{order.paymentResult?.id || 'SETTLED'}
                        </span>
                      </p>
                    ) : (
                      <p className="text-xs text-amber-800 flex items-center gap-2 font-light">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <span>Payment pending. Execute settlement below to confirm order.</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Order Items Ledger */}
                <div className="bg-white border border-sand/60 p-6 sm:p-8 shadow-sm">
                  <div className="pb-3 mb-4 border-b border-sand/40">
                    <span className="text-[10px] uppercase tracking-widest text-olive font-semibold">
                      Allocated Artifacts Snapshot
                    </span>
                  </div>

                  <div className="divide-y divide-sand/40">
                    {order.orderItems?.map((item, index) => (
                      <div
                        key={index}
                        className="py-4 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-sand/15 border border-sand/40 overflow-hidden shrink-0 flex items-center justify-center p-2">
                            <img
                              src={item.image}
                              alt={item.name}
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
                            <Link
                              to={`/product/${item.product}`}
                              className="font-serif text-base text-charcoal hover:text-olive transition block"
                            >
                              {item.name}
                            </Link>
                            <span className="text-xs text-charcoal/50 font-mono">
                              ${Number(item.price).toFixed(2)} &times; {item.qty} units
                            </span>
                          </div>
                        </div>
                        <span className="font-mono text-sm text-charcoal font-medium">
                          ${(item.qty * item.price).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Statement & Control Actions */}
              <div className="lg:col-span-4 bg-white border border-sand/60 p-6 sm:p-8 shadow-sm">
                <h2 className="font-serif text-xl text-charcoal pb-4 mb-6 border-b border-sand/40">
                  Statement Summary
                </h2>

                <div className="space-y-3.5 text-xs text-charcoal/70 mb-8 font-light">
                  <div className="flex justify-between items-center">
                    <span>Artifacts Subtotal</span>
                    <span className="font-mono text-charcoal font-medium">
                      ${Number(order.itemsPrice || 0).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Courier Delivery</span>
                    <span className="font-mono text-charcoal font-medium">
                      {Number(order.shippingPrice || 0) === 0 ? (
                        <span className="text-olive uppercase tracking-wider text-[11px]">
                          Complimentary
                        </span>
                      ) : (
                        `$${Number(order.shippingPrice).toFixed(2)}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Statutory Tax (15%)</span>
                    <span className="font-mono text-charcoal font-medium">
                      ${Number(order.taxPrice || 0).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-sand/40 text-sm text-charcoal">
                    <span className="font-serif text-base">Total Balance</span>
                    <span className="font-mono text-xl font-medium text-charcoal">
                      ${Number(order.totalPrice || 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Settlement Action Button */}
                {!order.isPaid && (
                  <div className="pt-4 border-t border-sand/40">
                    <div className="border border-sand bg-ivory/60 p-3 mb-4 text-[11px] text-charcoal/70">
                      <span className="font-medium text-charcoal block mb-0.5">
                        Evaluation Gateway Simulation
                      </span>
                      <span>
                        Simulate instantaneous bank authorization and record payment transaction.
                      </span>
                    </div>

                    <button
                      onClick={successPaymentHandler}
                      disabled={loadingPay}
                      className="w-full bg-charcoal hover:bg-olive text-ivory text-xs uppercase tracking-[0.2em] py-4 font-medium transition duration-300 flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>
                        {loadingPay
                          ? 'Authorizing...'
                          : `Authorize Payment &bull; $${Number(order.totalPrice).toFixed(2)}`}
                      </span>
                    </button>
                  </div>
                )}

                {/* Admin Courier Handover Button */}
                {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                  <div className="pt-6 border-t border-sand/40">
                    <div className="border border-sand bg-ivory/60 p-3 mb-4 text-[11px] text-charcoal/70">
                      <span className="font-medium text-charcoal block mb-0.5">
                        Privileged Logistics Action
                      </span>
                      <span>Mark physical parcel as successfully handed over to client.</span>
                    </div>

                    <button
                      onClick={deliverHandler}
                      disabled={loadingDeliver}
                      className="w-full border border-charcoal bg-white hover:bg-charcoal hover:text-ivory text-charcoal text-xs uppercase tracking-[0.2em] py-3.5 font-medium transition duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Truck className="w-3.5 h-3.5 text-olive" />
                      <span>
                        {loadingDeliver
                          ? 'Recording Handover...'
                          : 'Confirm Delivery (Admin)'}
                      </span>
                    </button>
                  </div>
                )}

                <div className="mt-6 pt-6 border-t border-sand/40 text-[11px] text-charcoal/60 leading-relaxed font-light">
                  <p className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-olive shrink-0" />
                    <span>Cryptographically verified against central database.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default OrderPage;
