import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Search,
  Calendar,
  Clock,
  User,
  Briefcase,
  Printer,
  CheckCircle2,
  AlertCircle,
  CalendarPlus,
  ArrowLeft,
  Mail,
  Phone,
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { api } from '../api/client';
import { formatDisplayDate, formatDisplayTime } from '../utils/dateUtils';

export const AppointmentLookupPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryId = searchParams.get('id') || '';

  const [appointmentIdInput, setAppointmentIdInput] = useState(queryId);
  const [appointment, setAppointment] = useState(null);
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const performLookup = async (idToSearch) => {
    const cleanId = (idToSearch || '').trim();
    if (!cleanId) {
      toast.error('Please enter an Appointment ID.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setAppointment(null);
    setClient(null);
    setSearched(true);

    try {
      const apt = await api.getAppointmentById(cleanId);
      setAppointment(apt);

      // Attempt to load client details for enrichment
      try {
        const clientData = await api.getClientById(apt.client_id);
        setClient(clientData);
      } catch (e) {
        // Client might not be found or error, continue with just apt
      }
    } catch (err) {
      setErrorMessage(err.message || `Appointment '${cleanId}' not found.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (queryId) {
      setAppointmentIdInput(queryId);
      performLookup(queryId);
    }
  }, [queryId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchParams({ id: appointmentIdInput.trim() });
    performLookup(appointmentIdInput.trim());
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-2xl mx-auto py-4 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy-900 tracking-tight flex items-center gap-2.5">
          <Search className="w-6 h-6 text-brand-600" />
          <span>Lookup Appointment</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Verify booking details and status using the unique appointment identifier.
        </p>
      </div>

      {/* Search Bar */}
      <Card className="p-4 shadow-sm">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={appointmentIdInput}
              onChange={(e) => setAppointmentIdInput(e.target.value)}
              placeholder="Enter Appointment ID (e.g., apt-101)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={loading}
            disabled={loading || !appointmentIdInput.trim()}
          >
            Lookup
          </Button>
        </form>
      </Card>

      {/* Results */}
      {loading ? (
        <Card className="p-8">
          <LoadingSpinner text="Searching appointment database..." />
        </Card>
      ) : errorMessage ? (
        <Card className="p-8 border-rose-200 bg-rose-50/40 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-rose-900">Record Not Found</h3>
          <p className="text-xs text-rose-700 max-w-sm mx-auto">{errorMessage}</p>
          <div className="pt-2">
            <Link to="/appointments">
              <Button variant="outline" size="sm">
                Browse All Appointments
              </Button>
            </Link>
          </div>
        </Card>
      ) : appointment ? (
        <div className="space-y-4">
          {/* Appointment Pass Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden print:border-none print:shadow-none">
            {/* Ticket Header */}
            <div className="bg-navy-900 text-white p-6 flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-brand-400 font-semibold">
                  AppointmentHub Booking Confirmation
                </span>
                <h2 className="text-xl font-bold mt-0.5">{appointment.service_type}</h2>
              </div>
              <StatusBadge status={appointment.status} size="lg" />
            </div>

            {/* Ticket Body */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Appointment ID
                  </span>
                  <p className="font-mono text-sm font-bold text-navy-900 mt-0.5">
                    {appointment.appointment_id}
                  </p>
                </div>
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Date
                  </span>
                  <p className="text-sm font-bold text-navy-900 mt-0.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-brand-600" />
                    <span>{formatDisplayDate(appointment.date)}</span>
                  </p>
                </div>
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Time
                  </span>
                  <p className="text-sm font-bold text-navy-900 mt-0.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-brand-600" />
                    <span>{formatDisplayTime(appointment.time)}</span>
                  </p>
                </div>
              </div>

              {/* Client Section */}
              <div className="border-t border-slate-100 pt-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Client Information</span>
                </h4>

                <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Client ID:</span>
                    <span className="font-mono font-bold text-slate-800">{appointment.client_id}</span>
                  </div>
                  {client && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Client Name:</span>
                        <span className="font-bold text-slate-800">{client.name}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Email:</span>
                        <span className="text-slate-700">{client.email}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Phone:</span>
                        <span className="text-slate-700">{client.phone}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Notice */}
              <div className="text-[11px] text-slate-400 italic text-center pt-2">
                Please present this ID or confirmation when arriving for your consultation.
              </div>
            </div>

            {/* Actions Toolbar */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between gap-3 print:hidden">
              <Link to="/appointments">
                <Button variant="ghost" size="sm" icon={ArrowLeft}>
                  All Appointments
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" icon={Printer} onClick={handlePrint}>
                  Print Receipt
                </Button>
                <Link to="/book">
                  <Button variant="accent" size="sm" icon={CalendarPlus}>
                    Book Another
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
