import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import CheckoutSteps from '../components/CheckoutSteps';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { createOrder } from '../actions/orderActions';
import { ORDER_CREATE_RESET } from '../constants/orderConstants';

const PlaceOrderPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { cartItems, shippingAddress, paymentMethod } = cart;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, success, error, loading } = orderCreate;

  const addDecimals = (num) => (Math.round(num * 100) / 100).toFixed(2);

  const itemsPrice = addDecimals(
    cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );
  const shippingPrice = addDecimals(Number(itemsPrice) > 100 ? 0 : 15);
  const taxPrice = addDecimals(Number((0.15 * Number(itemsPrice)).toFixed(2)));
  const totalPrice = (
    Number(itemsPrice) +
    Number(shippingPrice) +
    Number(taxPrice)
  ).toFixed(2);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login?redirect=placeorder');
    } else if (!shippingAddress || !shippingAddress.address) {
      navigate('/shipping');
    } else if (success && order) {
      navigate(`/order/${order._id}`);
      dispatch({ type: ORDER_CREATE_RESET });
    }
  }, [navigate, success, order, userInfo, shippingAddress, dispatch]);

  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: cartItems.map((item) => ({
          product: item.product,
          name: item.name,
          image: item.image,
          price: item.price,
          qty: item.qty,
        })),
        shippingAddress,
        paymentMethod,
        itemsPrice: Number(itemsPrice),
        shippingPrice: Number(shippingPrice),
        taxPrice: Number(taxPrice),
        totalPrice: Number(totalPrice),
      })
    );
  };

  return (
    <div className="bg-canvas min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CheckoutSteps step1 step2 step3 step4 />

        <div className="pb-6 mb-8 border-b border-sand/60">
          <div className="inline-flex items-center gap-2 mb-1.5">
            <span className="w-4 h-px bg-olive"></span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-olive font-semibold">
              Step 04 / Final Verification
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal">
            Review & Authorize Order
          </h1>
        </div>

        {error && <Message variant="danger">{error}</Message>}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Delivery, Billing, and Artifacts Review */}
          <div className="lg:col-span-8 space-y-6">
            {/* Courier Destination */}
            <div className="bg-white border border-sand/60 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-sand/40">
                <span className="text-[10px] uppercase tracking-widest text-olive font-semibold">
                  Courier Destination
                </span>
                <Link
                  to="/shipping"
                  className="text-xs uppercase tracking-wider text-charcoal/50 hover:text-charcoal underline"
                >
                  Edit
                </Link>
              </div>
              <p className="font-serif text-lg text-charcoal mb-1">
                {userInfo?.name}
              </p>
              <p className="text-xs text-charcoal/70 font-light">
                {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode},{' '}
                {shippingAddress.country}
              </p>
              <p className="text-[11px] text-charcoal/50 font-mono mt-1">
                Notification recipient: {userInfo?.email}
              </p>
            </div>

            {/* Payment Instrument */}
            <div className="bg-white border border-sand/60 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-sand/40">
                <span className="text-[10px] uppercase tracking-widest text-olive font-semibold">
                  Payment Instrument
                </span>
                <Link
                  to="/payment"
                  className="text-xs uppercase tracking-wider text-charcoal/50 hover:text-charcoal underline"
                >
                  Edit
                </Link>
              </div>
              <p className="font-serif text-lg text-charcoal mb-1">
                {paymentMethod}
              </p>
              <p className="text-xs text-charcoal/60 font-light">
                Encrypted allocation. Authorization captured upon final order submission.
              </p>
            </div>

            {/* Artifacts List */}
            <div className="bg-white border border-sand/60 p-6 sm:p-8 shadow-sm">
              <div className="pb-3 mb-4 border-b border-sand/40">
                <span className="text-[10px] uppercase tracking-widest text-olive font-semibold">
                  Selected Artifacts ({cartItems.length})
                </span>
              </div>

              {cartItems.length === 0 ? (
                <Message>Your bag contains no items</Message>
              ) : (
                <div className="divide-y divide-sand/40">
                  {cartItems.map((item) => (
                    <div
                      key={item.product}
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
              )}
            </div>
          </div>

          {/* Right Column: Statement & Order Button */}
          <div className="lg:col-span-4 bg-white border border-sand/60 p-6 sm:p-8 shadow-sm">
            <h2 className="font-serif text-xl text-charcoal pb-4 mb-6 border-b border-sand/40">
              Payment Statement
            </h2>

            <div className="space-y-3.5 text-xs text-charcoal/70 mb-8 font-light">
              <div className="flex justify-between items-center">
                <span>Items Subtotal</span>
                <span className="font-mono text-charcoal font-medium">
                  ${itemsPrice}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span>Insured Courier Delivery</span>
                <span className="font-mono text-charcoal font-medium">
                  {Number(shippingPrice) === 0 ? (
                    <span className="text-olive uppercase tracking-wider text-[11px]">
                      Complimentary
                    </span>
                  ) : (
                    `$${shippingPrice}`
                  )}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span>Estimated Statutory Tax (15%)</span>
                <span className="font-mono text-charcoal font-medium">
                  ${taxPrice}
                </span>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-sand/40 text-sm text-charcoal">
                <span className="font-serif text-base">Grand Total</span>
                <span className="font-mono text-xl font-medium text-charcoal">
                  ${totalPrice}
                </span>
              </div>
            </div>

            <button
              onClick={placeOrderHandler}
              disabled={cartItems.length === 0 || loading}
              className="w-full bg-charcoal hover:bg-olive text-ivory text-xs uppercase tracking-[0.2em] py-4 font-medium transition duration-300 flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {loading ? (
                <span>Persisting Order...</span>
              ) : (
                <>
                  <span>Confirm & Authorize</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>

            {loading && (
              <div className="mt-4">
                <Loader size="sm" text="Recording verified order in database..." />
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-sand/40 text-[11px] text-charcoal/60 leading-relaxed font-light">
              <p className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-olive shrink-0" />
                <span>All line items and pricing are verified against backend ledger.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderPage;
