import React from 'react';
import { Clock, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';

export const StatusBadge = ({ status, size = 'md' }) => {
  const normStatus = (status || '').toLowerCase();

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs font-medium px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-medium px-3 py-1.5 gap-2',
  }[size] || 'text-xs px-2.5 py-1 gap-1.5';

  if (normStatus === 'confirmed') {
    return (
      <span className={`inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 ${sizeClasses}`}>
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        <span className="capitalize">Confirmed</span>
      </span>
    );
  }

  if (normStatus === 'cancelled') {
    return (
      <span className={`inline-flex items-center rounded-full bg-rose-50 text-rose-700 border border-rose-200/80 ${sizeClasses}`}>
        <XCircle className="w-3.5 h-3.5 text-rose-600" />
        <span className="capitalize">Cancelled</span>
      </span>
    );
  }

  if (normStatus === 'pending') {
    return (
      <span className={`inline-flex items-center rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 ${sizeClasses}`}>
        <Clock className="w-3.5 h-3.5 text-amber-600" />
        <span className="capitalize">Pending</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center rounded-full bg-slate-100 text-slate-700 border border-slate-200 ${sizeClasses}`}>
      <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
      <span className="capitalize">{status || 'Unknown'}</span>
    </span>
  );
};
