import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

const Message = ({ variant = 'info', children }) => {
  const styles = {
    danger: 'bg-red-50/70 border-red-200/80 text-red-900',
    success: 'bg-emerald-50/70 border-emerald-200/80 text-emerald-900',
    info: 'bg-ivory border-sand/70 text-charcoal',
    warning: 'bg-amber-50/70 border-amber-200/80 text-amber-900',
  };

  const icons = {
    danger: <AlertCircle className="w-4 h-4 mr-3 text-red-600 shrink-0" />,
    success: <CheckCircle2 className="w-4 h-4 mr-3 text-emerald-600 shrink-0" />,
    info: <Info className="w-4 h-4 mr-3 text-olive shrink-0" />,
    warning: <AlertTriangle className="w-4 h-4 mr-3 text-amber-600 shrink-0" />,
  };

  return (
    <div
      role="alert"
      className={`border px-4 py-3.5 my-3 flex items-start text-xs sm:text-sm font-normal tracking-wide transition-all ${
        styles[variant] || styles.info
      }`}
    >
      <div className="mt-0.5">{icons[variant] || icons.info}</div>
      <div className="leading-relaxed flex-1">{children}</div>
    </div>
  );
};

export default Message;
