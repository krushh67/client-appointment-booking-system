import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, Home, CalendarPlus } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
        <HelpCircle className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-navy-900 tracking-tight">404</h1>
      <p className="text-base font-semibold text-slate-700 mt-1">Page Not Found</p>
      <p className="text-xs text-slate-500 max-w-sm mt-2 mb-6">
        The requested application route does not exist. Please use the navigation menu or return to the overview page.
      </p>
      <div className="flex gap-3">
        <Link to="/">
          <Button variant="primary" size="md" icon={Home}>
            Back to Home
          </Button>
        </Link>
        <Link to="/book">
          <Button variant="outline" size="md" icon={CalendarPlus}>
            Book Appointment
          </Button>
        </Link>
      </div>
    </div>
  );
};
