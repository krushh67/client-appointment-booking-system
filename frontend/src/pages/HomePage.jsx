import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarPlus,
  UserPlus,
  CalendarCheck2,
  Search,
  ShieldCheck,
  Server,
  ArrowRight,
  Sparkles,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { useSystem } from '../context/SystemContext';
import { api } from '../api/client';

export const HomePage = () => {
  const { isBackendHealthy, backendStatusInfo } = useSystem();
  const [stats, setStats] = useState({ clients: 0, appointments: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchQuickMetrics = async () => {
      try {
        const [clients, appointments] = await Promise.all([
          api.getClients().catch(() => []),
          api.getAppointments().catch(() => []),
        ]);
        if (isMounted) {
          setStats({
            clients: clients.length,
            appointments: appointments.length,
            pending: appointments.filter((a) => a.status === 'pending').length,
          });
        }
      } catch (e) {
        // Silent catch for initial metrics
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchQuickMetrics();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-12 py-4">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-navy-900 via-navy-900 to-navy-950 text-white p-8 sm:p-12 lg:p-16 shadow-xl border border-navy-800">
        {/* Subtle accent glow */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-brand-300 text-xs font-semibold tracking-wide backdrop-blur border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>FastAPI & React Integrated System</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Book your next appointment with ease
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
            A reliable, responsive client appointment scheduling platform. Register client records, schedule verified service appointments, and manage booking statuses seamlessly.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link to="/book">
              <Button variant="accent" size="lg" icon={CalendarPlus}>
                Book an Appointment
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" size="lg" icon={UserPlus} className="text-slate-800 bg-white hover:bg-slate-100 border-white">
                Register as a Client
              </Button>
            </Link>
          </div>
        </div>

        {/* Live system status strip at bottom of hero */}
        <div className="relative z-10 mt-10 pt-6 border-t border-navy-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-brand-400" />
            <span>Backend Service:</span>
            <span className={`font-semibold ${isBackendHealthy ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isBackendHealthy ? 'Online (Port 8000)' : 'Awaiting Connection'}
            </span>
          </div>
          <div className="flex items-center gap-6 text-slate-300">
            <div>
              <span className="font-bold text-white mr-1.5">{loading ? '...' : stats.clients}</span>
              <span className="text-slate-400">Clients</span>
            </div>
            <div>
              <span className="font-bold text-white mr-1.5">{loading ? '...' : stats.appointments}</span>
              <span className="text-slate-400">Appointments</span>
            </div>
            <div>
              <span className="font-bold text-amber-400 mr-1.5">{loading ? '...' : stats.pending}</span>
              <span className="text-slate-400">Pending</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Capabilities Grid */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-navy-900 tracking-tight">
            Core System Features
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Engineered around the verified backend modules and data models.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <Card hoverable className="p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
                <UserPlus className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-navy-900">Client Registration</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Register clients with unique identifiers, contact phone numbers, and emails. Validated against the in-memory store with collision detection.
              </p>
            </div>
            <div className="pt-6">
              <Link to="/register" className="inline-flex items-center text-sm font-semibold text-brand-600 hover:text-brand-700 gap-1.5">
                Register new client <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Card>

          {/* Card 2 */}
          <Card hoverable className="p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <CalendarPlus className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-navy-900">Appointment Scheduling</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Schedule consultations and checkups. The appointment router enforces strict referential integrity with client existence verification.
              </p>
            </div>
            <div className="pt-6">
              <Link to="/book" className="inline-flex items-center text-sm font-semibold text-brand-600 hover:text-brand-700 gap-1.5">
                Book appointment <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Card>

          {/* Card 3 */}
          <Card hoverable className="p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                <CalendarCheck2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-navy-900">Tracking & Admin Management</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Filter and track appointments across pending, confirmed, and cancelled statuses. Search records and update booking states.
              </p>
            </div>
            <div className="pt-6">
              <Link to="/appointments" className="inline-flex items-center text-sm font-semibold text-brand-600 hover:text-brand-700 gap-1.5">
                View all bookings <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* Quick Lookup & Direct Access */}
      <section className="bg-slate-100/70 border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-base font-bold text-navy-900">Already have an appointment ID?</h3>
          <p className="text-xs sm:text-sm text-slate-600">
            Look up your appointment details, schedule verification, and status badge instantly.
          </p>
        </div>
        <Link to="/lookup">
          <Button variant="primary" size="md" icon={Search}>
            Lookup Appointment
          </Button>
        </Link>
      </section>
    </div>
  );
};
