import React from 'react';
import { Link } from 'react-router-dom';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  const steps = [
    { num: '01', name: 'Identification', active: step1, link: '/login' },
    { num: '02', name: 'Shipping Address', active: step2, link: '/shipping' },
    { num: '03', name: 'Payment Method', active: step3, link: '/payment' },
    { num: '04', name: 'Final Review', active: step4, link: '/placeorder' },
  ];

  return (
    <nav className="flex items-center justify-center mb-10 px-4">
      <ol className="flex items-center w-full max-w-2xl justify-between">
        {steps.map((step, index) => (
          <li key={step.name} className="flex items-center">
            {step.active ? (
              <Link
                to={step.link}
                className="flex items-center gap-2 group transition"
              >
                <span className="w-6 h-6 rounded-full bg-olive text-ivory text-[10px] font-mono flex items-center justify-center font-medium">
                  {step.num}
                </span>
                <span className="text-xs uppercase tracking-wider text-charcoal font-medium hidden sm:inline group-hover:text-olive transition">
                  {step.name}
                </span>
              </Link>
            ) : (
              <span className="flex items-center gap-2 text-charcoal/30 cursor-not-allowed">
                <span className="w-6 h-6 rounded-full border border-sand/80 text-[10px] font-mono flex items-center justify-center text-charcoal/40">
                  {step.num}
                </span>
                <span className="text-xs uppercase tracking-wider text-charcoal/40 hidden sm:inline">
                  {step.name}
                </span>
              </span>
            )}

            {index < steps.length - 1 && (
              <div className="w-6 sm:w-12 h-px bg-sand/60 mx-2 sm:mx-4" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default CheckoutSteps;
