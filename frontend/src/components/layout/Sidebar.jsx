import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  CalendarPlus,
  UserPlus,
  Users,
  CalendarCheck2,
  Search,
  ShieldAlert,
  Server,
  X,
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const clientNavItems = [
    { label: 'Overview', to: '/', icon: Home },
    { label: 'Book Appointment', to: '/book', icon: CalendarPlus },
    { label: 'Register Client', to: '/register', icon: UserPlus },
    { label: 'Clients Directory', to: '/clients', icon: Users },
    { label: 'All Appointments', to: '/appointments', icon: CalendarCheck2 },
    { label: 'Lookup by ID', to: '/lookup', icon: Search },
  ];

  const adminNavItems = [
    { label: 'Admin Dashboard', to: '/admin', icon: ShieldAlert },
  ];

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-navy-900 text-white shadow-sm'
        : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100/90'
    }`;

  const content = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 w-64 select-none">
      {/* Mobile close button */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-100">
        <span className="font-semibold text-sm text-navy-900">Navigation</span>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-500 hover:bg-slate-100"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
        {/* Client Section */}
        <div>
          <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Client Portal
          </p>
          <nav className="space-y-1">
            {clientNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={() => onClose?.()}
                  className={navLinkClass}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Administration Section */}
        <div>
          <div className="px-3 flex items-center justify-between mb-2">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Administration
            </p>
            <span className="text-[9px] font-semibold bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200">
              Demo/Unauth
            </span>
          </div>
          <nav className="space-y-1">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => onClose?.()}
                  className={navLinkClass}
                >
                  <Icon className="w-4 h-4 flex-shrink-0 text-amber-500" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Backend & Architecture Storage Notice */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/70">
        <div className="flex items-start gap-2.5">
          <Server className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
          <div className="text-[11px] text-slate-500 leading-tight">
            <span className="font-semibold text-slate-700 block mb-0.5">In-Memory Storage</span>
            Data is stored in runtime dictionaries. Records reset on server restart.
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop static sidebar */}
      <aside className="hidden lg:block h-[calc(100vh-61px)] sticky top-[61px] flex-shrink-0">
        {content}
      </aside>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-navy-950/40 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 left-0 z-50 flex shadow-2xl">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
