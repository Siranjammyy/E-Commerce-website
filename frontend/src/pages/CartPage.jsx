import React, { useEffect } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Trash2,
  ShoppingBag,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Plus,
  Minus,
  Truck,
} from 'lucide-react';
import { addToCart, updateCartQty, removeFromCart } from '../actions/cartActions';

const CartPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const queryParams = new URLSearchParams(location.search);
  const qty = queryParams.get('qty') ? Number(queryParams.get('qty')) : 1;

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (id) {
      dispatch(addToCart(id, qty));
    }
  }, [dispatch, id, qty]);

  const removeFromCartHandler = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const updateQuantityHandler = (productId, newQty, countInStock) => {
    if (newQty > 0 && newQty <= countInStock) {
      dispatch(updateCartQty(productId, newQty));
    }
  };

  const checkoutHandler = () => {
    if (!userInfo) {
      navigate('/login?redirect=shipping');
    } else {
      navigate('/shipping');
    }
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
  const shippingEstimate = subtotal > 100 || subtotal === 0 ? 0 : 15;
  const grandTotal = subtotal + shippingEstimate;

  return (
    <div className="bg-canvas min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 mb-8 border-b border-sand/60 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-1.5">
              <span className="w-4 h-px bg-olive"></span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-olive font-semibold">
                Order Review
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal">
              Your Shopping Bag
            </h1>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-charcoal/60 hover:text-charcoal transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Browsing</span>
          </Link>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white border border-sand p-12 sm:p-16 text-center max-w-lg mx-auto shadow-sm my-12">
            <ShoppingBag className="w-12 h-12 text-sand mx-auto mb-4" />
            <h2 className="font-serif text-2xl sm:text-3xl text-charcoal mb-2">
              Your bag is currently empty
            </h2>
            <p className="text-xs text-charcoal/60 leading-relaxed mb-8 max-w-sm mx-auto font-light">
              You haven&apos;t added any audio monitors, cameras, or workstation pieces yet.
              Explore our curated catalog to begin.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-charcoal text-ivory text-xs uppercase tracking-widest px-8 py-3.5 font-medium hover:bg-olive transition duration-300"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              <div className="hidden sm:grid grid-cols-12 text-[10px] uppercase tracking-widest text-charcoal/50 pb-3 border-b border-sand/40 px-2">
                <span className="col-span-6">Item Particulars</span>
                <span className="col-span-3 text-center">Quantity</span>
                <span className="col-span-3 text-right">Line Total</span>
              </div>

              {cartItems.map((item) => (
                <div
                  key={item.product}
                  className="bg-white border border-sand/60 p-4 sm:p-6 transition hover:border-sand flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
                >
                  {/* Thumbnail */}
                  <Link
                    to={`/product/${item.product}`}
                    className="w-20 h-20 sm:w-24 sm:h-24 bg-sand/15 border border-sand/40 overflow-hidden shrink-0 flex items-center justify-center p-2"
                  >
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
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <span className="text-[10px] uppercase tracking-widest text-olive font-semibold block mb-1">
                      {item.brand || 'Authentic'}
                    </span>
                    <Link
                      to={`/product/${item.product}`}
                      className="font-serif text-lg text-charcoal hover:text-olive transition truncate block"
                      title={item.name}
                    >
                      {item.name}
                    </Link>
                    <span className="font-mono text-xs text-charcoal/60 mt-1 block">
                      ${Number(item.price).toFixed(2)} USD each
                    </span>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-sand bg-white">
                    <button
                      onClick={() =>
                        updateQuantityHandler(item.product, item.qty - 1, item.countInStock)
                      }
                      disabled={item.qty <= 1}
                      className="p-2 text-charcoal hover:bg-sand/20 disabled:opacity-30 disabled:hover:bg-transparent transition"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-mono text-xs px-3 py-1 text-charcoal font-medium min-w-[2.2rem] text-center select-none">
                      {item.qty}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantityHandler(item.product, item.qty + 1, item.countInStock)
                      }
                      disabled={item.qty >= item.countInStock}
                      className="p-2 text-charcoal hover:bg-sand/20 disabled:opacity-30 disabled:hover:bg-transparent transition"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-right sm:min-w-[100px]">
                    <span className="font-mono text-base text-charcoal font-medium block">
                      ${(item.qty * item.price).toFixed(2)}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCartHandler(item.product)}
                    className="p-2 text-charcoal/40 hover:text-red-700 transition"
                    title="Remove item"
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {/* Complimentary Transit Banner */}
              <div className="border border-sand/60 bg-ivory/60 p-4 flex flex-col sm:flex-row items-center justify-between text-xs text-charcoal/80 gap-2">
                <span className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-olive shrink-0" />
                  <span>All shipments are insured with tracked direct courier</span>
                </span>
                <span className="text-[11px] uppercase tracking-wider font-medium text-olive">
                  {subtotal > 100
                    ? 'Complimentary Delivery Qualified'
                    : `Add $${(100 - subtotal).toFixed(2)} for Free Shipping`}
                </span>
              </div>
            </div>

            {/* Order Summary Checkout Card */}
            <div className="lg:col-span-4 bg-white border border-sand/60 p-6 sm:p-8 shadow-sm">
              <h2 className="font-serif text-xl text-charcoal pb-4 mb-6 border-b border-sand/40">
                Summary of Order
              </h2>

              <div className="space-y-4 text-xs text-charcoal/70 mb-8 font-light">
                <div className="flex justify-between items-center">
                  <span>Selected Units ({totalItems})</span>
                  <span className="font-mono text-charcoal font-medium">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span>Insured Courier Delivery</span>
                  <span className="font-mono text-charcoal font-medium">
                    {shippingEstimate === 0 ? (
                      <span className="text-olive uppercase tracking-wider text-[11px]">
                        Complimentary
                      </span>
                    ) : (
                      `$${shippingEstimate.toFixed(2)}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-sand/40 text-sm font-normal text-charcoal">
                  <span className="font-serif text-base">Estimated Total</span>
                  <span className="font-mono text-xl font-medium text-charcoal">
                    ${grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={checkoutHandler}
                disabled={cartItems.length === 0}
                className="w-full bg-charcoal hover:bg-olive text-ivory text-xs uppercase tracking-[0.2em] py-4 font-medium transition duration-300 flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="mt-6 pt-6 border-t border-sand/40 space-y-2 text-[11px] text-charcoal/60 leading-relaxed font-light">
                <p className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-olive shrink-0" />
                  <span>Authentic manufacturer warranty & insured dispatch</span>
                </p>
                <p>
                  Destination tax calculated during checkout in accordance with regional jurisdiction.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
