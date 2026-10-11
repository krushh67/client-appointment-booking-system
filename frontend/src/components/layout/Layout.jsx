import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      <Navbar onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />

      <div className="flex flex-1">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <main className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </div>

          <footer className="border-t border-slate-200 bg-white py-6 px-6 text-center text-xs text-slate-500">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="font-semibold text-slate-700">AppointmentHub</span> — Client Appointment Booking System
              </div>
              <div className="text-slate-400">
                Stateless RESTful Architecture · FastAPI & React
              </div>
            </div>
          </footer>
        </main>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#0f172a',
            color: '#fff',
            fontSize: '13px',
            borderRadius: '10px',
            padding: '12px 16px',
          },
          success: {
            iconTheme: {
              primary: '#14b8a6',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#f43f5e',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
};
