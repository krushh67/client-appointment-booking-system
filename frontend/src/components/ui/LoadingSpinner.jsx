import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ text = 'Loading...', size = 'md' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-7 h-7',
    lg: 'w-10 h-10',
  }[size] || 'w-7 h-7';

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3">
      <Loader2 className={`${sizes} animate-spin text-brand-600`} />
      {text && <p className="text-xs font-medium text-slate-500 tracking-wide">{text}</p>}
    </div>
  );
};

export const TableSkeleton = ({ rows = 4, cols = 5 }) => {
  return (
    <div className="w-full animate-pulse space-y-3 p-4">
      {Array.from({ length: rows }).map((_, rIdx) => (
        <div key={rIdx} className="flex gap-4 items-center">
          {Array.from({ length: cols }).map((_, cIdx) => (
            <div
              key={cIdx}
              className="h-4 bg-slate-200/80 rounded"
              style={{ width: `${Math.max(60, 100 - cIdx * 15)}px` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
