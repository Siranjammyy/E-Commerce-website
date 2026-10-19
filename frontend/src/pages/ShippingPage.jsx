import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { saveShippingAddress } from '../actions/cartActions';
import CheckoutSteps from '../components/CheckoutSteps';

const ShippingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress, cartItems } = cart;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  // Protect checkout route: redirect unauthenticated users to login
  useEffect(() => {
    if (!userInfo) {
      navigate('/login?redirect=shipping');
    } else if (!cartItems || cartItems.length === 0) {
      navigate('/cart');
    }
  }, [navigate, userInfo, cartItems]);

  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || 'United States');

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate('/payment');
  };

  return (
    <div className="bg-canvas min-h-screen py-10 sm:py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <CheckoutSteps step1 step2 />

        <div className="bg-white border border-sand/60 p-8 sm:p-10 shadow-sm">
          <div className="border-b border-sand/40 pb-5 mb-8">
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="w-4 h-px bg-olive"></span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-olive font-semibold">
                Step 02 / Destination
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl text-charcoal font-normal">
              Courier Delivery Details
            </h1>
            <p className="text-xs text-charcoal/60 mt-1 font-light">
              Specify the street location where your artifacts will be delivered.
            </p>
          </div>

          <form onSubmit={submitHandler} className="space-y-6">
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-charcoal/70 mb-2 font-medium">
                Street Address *
              </label>
              <input
                type="text"
                className="w-full bg-ivory/40 border border-sand px-4 py-3 text-xs sm:text-sm text-charcoal placeholder-charcoal/40 focus:outline-none focus:border-charcoal focus:bg-white transition"
                placeholder="e.g. 742 Evergreen Terrace, Suite 4B"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-charcoal/70 mb-2 font-medium">
                  City / Municipality *
                </label>
                <input
                  type="text"
                  className="w-full bg-ivory/40 border border-sand px-4 py-3 text-xs sm:text-sm text-charcoal placeholder-charcoal/40 focus:outline-none focus:border-charcoal focus:bg-white transition"
                  placeholder="e.g. Seattle"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-widest text-charcoal/70 mb-2 font-medium">
                  Postal Code *
                </label>
                <input
                  type="text"
                  className="w-full bg-ivory/40 border border-sand px-4 py-3 text-xs sm:text-sm text-charcoal placeholder-charcoal/40 focus:outline-none focus:border-charcoal focus:bg-white transition"
                  placeholder="e.g. 98101"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-widest text-charcoal/70 mb-2 font-medium">
                Country / Region *
              </label>
              <input
                type="text"
                className="w-full bg-ivory/40 border border-sand px-4 py-3 text-xs sm:text-sm text-charcoal placeholder-charcoal/40 focus:outline-none focus:border-charcoal focus:bg-white transition"
                placeholder="e.g. United States"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-charcoal hover:bg-olive text-ivory text-xs uppercase tracking-[0.2em] py-4 font-medium transition duration-300 flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Continue to Payment Method</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-sand/40 flex items-center justify-between text-[11px] text-charcoal/60">
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-olive" />
              Direct door courier
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-olive" />
              Full insurance coverage
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPage;
