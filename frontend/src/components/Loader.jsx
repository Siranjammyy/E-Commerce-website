import React from 'react';

const Loader = ({ size = 'md', text = 'Curating catalog...' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-[2px]',
    md: 'w-9 h-9 border-[2px]',
    lg: 'w-14 h-14 border-[2.5px]',
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div
        className={`${
          sizeClasses[size] || sizeClasses.md
        } border-sand/40 border-t-olive rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      />
      {text && (
        <p className="mt-4 text-xs tracking-wider uppercase text-charcoal/60 font-medium">
          {text}
        </p>
      )}
    </div>
  );
};

export default Loader;
