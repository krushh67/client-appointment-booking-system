import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Menu, RefreshCw, PlusCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import { useSystem } from '../../context/SystemContext';
import { Button } from '../ui/Button';

export const Navbar = ({ onToggleSidebar }) => {
  const { isBackendHealthy, backendStatusInfo, triggerGlobalRefresh } = useSystem();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200/80 px-4 sm:px-6 py-3.5">
      <div className="flex items-center justify-between">
        {/* Left: Mobile hamburger & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-navy-900 to-navy-800 flex items-center justify-center text-brand-400 shadow-sm group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-navy-900 tracking-tight flex items-center gap-1">
                Appointment<span className="text-brand-600 font-extrabold">Hub</span>
              </span>
              <span className="hidden sm:block text-[10px] text-slate-400 font-medium uppercase tracking-wider -mt-1">
                Client Booking System
              </span>
            </div>
          </Link>
        </div>

        {/* Right: Backend health indicator & Quick CTA */}
        <div className="flex items-center gap-3">
          {/* Health status pill */}
          <div
            className={`hidden sm:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
              isBackendHealthy === true
                ? 'bg-emerald-50/80 text-emerald-700 border-emerald-200'
                : isBackendHealthy === false
                ? 'bg-rose-50/80 text-rose-700 border-rose-200'
                : 'bg-slate-50 text-slate-500 border-slate-200'
            }`}
            title={`API Status: ${backendStatusInfo}`}
          >
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isBackendHealthy === true
                    ? 'bg-emerald-400'
                    : isBackendHealthy === false
                    ? 'bg-rose-400'
                    : 'bg-slate-400'
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isBackendHealthy === true
                    ? 'bg-emerald-500'
                    : isBackendHealthy === false
                    ? 'bg-rose-500'
                    : 'bg-slate-400'
                }`}
              />
            </span>
            <span className="font-medium">
              {isBackendHealthy === true
                ? 'API Connected'
                : isBackendHealthy === false
                ? 'Backend Offline'
                : 'Connecting...'}
            </span>

            <button
              onClick={triggerGlobalRefresh}
              className="p-0.5 rounded text-slate-400 hover:text-slate-600 transition-colors ml-0.5"
              title="Refresh connection"
            >
              <RefreshCw className="w-3 h-3 hover:rotate-180 transition-transform duration-300" />
            </button>
          </div>

          <Link to="/book">
            <Button variant="accent" size="sm" icon={PlusCircle}>
              <span className="hidden sm:inline">Book Appointment</span>
              <span className="sm:hidden">Book</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
