import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { savePaymentMethod } from '../actions/cartActions';
import CheckoutSteps from '../components/CheckoutSteps';

const PaymentPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo) {
      navigate('/login?redirect=payment');
    } else if (!shippingAddress || !shippingAddress.address) {
      navigate('/shipping');
    }
  }, [navigate, userInfo, shippingAddress]);

  const [paymentMethod, setPaymentMethod] = useState(
    cart.paymentMethod || 'Demo Payment'
  );

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };

  const methods = [
    {
      id: 'Demo Payment',
      title: 'VERO Instant Settlement',
      tag: 'Verified Evaluation',
      desc: 'Simulates instantaneous authorization and payment capture. Recommended for full-stack review without live banking credentials.',
    },
    {
      id: 'PayPal',
      title: 'Digital Card / PayPal Sandbox',
      tag: 'Electronic Transfer',
      desc: 'Standard sandbox payment processing with simulated external authorization flow.',
    },
    {
      id: 'Cash on Delivery',
      title: 'Courier Settlement on Handover',
      tag: 'Physical Invoicing',
      desc: 'Settle order balance directly upon physical courier receipt at the delivery address.',
    },
  ];

  return (
    <div className="bg-canvas min-h-screen py-10 sm:py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <CheckoutSteps step1 step2 step3 />

        <div className="bg-white border border-sand/60 p-8 sm:p-10 shadow-sm">
          <div className="border-b border-sand/40 pb-5 mb-8">
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="w-4 h-px bg-olive"></span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-olive font-semibold">
                Step 03 / Billing
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl text-charcoal font-normal">
              Payment Instrument
            </h1>
            <p className="text-xs text-charcoal/60 mt-1 font-light">
              Select your payment gateway or simulation method to proceed with order allocation.
            </p>
          </div>

          <form onSubmit={submitHandler} className="space-y-4">
            <div className="space-y-3">
              {methods.map((method) => {
                const isSelected = paymentMethod === method.id;
                return (
                  <label
                    key={method.id}
                    className={`flex items-start p-5 border cursor-pointer transition ${
                      isSelected
                        ? 'border-charcoal bg-ivory/50 shadow-sm'
                        : 'border-sand/70 bg-white hover:border-sand'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={isSelected}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mt-1 accent-[#2D4436]"
                    />
                    <div className="ml-3.5 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-serif text-base text-charcoal">
                          {method.title}
                        </span>
                        <span className="text-[10px] uppercase tracking-widest text-olive font-medium bg-sand/30 px-2 py-0.5 border border-sand/60">
                          {method.tag}
                        </span>
                      </div>
                      <p className="text-xs text-charcoal/60 mt-1.5 leading-relaxed font-light">
                        {method.desc}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>

            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-charcoal hover:bg-olive text-ivory text-xs uppercase tracking-[0.2em] py-4 font-medium transition duration-300 flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Proceed to Final Review</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-sand/40 flex items-center gap-2 text-[11px] text-charcoal/60">
            <ShieldCheck className="w-4 h-4 text-olive shrink-0" />
            <span>End-to-end encrypted session &bull; Zero sensitive card retention</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
