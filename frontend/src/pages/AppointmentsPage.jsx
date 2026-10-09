import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  CalendarCheck2,
  Search,
  CalendarPlus,
  RefreshCw,
  Filter,
  Eye,
  User,
  Calendar as CalendarIcon,
  Clock,
  Briefcase,
  IdCard,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { LoadingSpinner, TableSkeleton } from '../components/ui/LoadingSpinner';
import { EmptyState } from '../components/ui/EmptyState';
import { Modal } from '../components/ui/Modal';
import { api } from '../api/client';
import { formatDisplayDate, formatDisplayTime } from '../utils/dateUtils';
import { useSystem } from '../context/SystemContext';

export const AppointmentsPage = () => {
  const navigate = useNavigate();
  const { refreshIndex } = useSystem();

  const [appointments, setAppointments] = useState([]);
  const [clientsMap, setClientsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // all, pending, confirmed, cancelled
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [aptsData, clientsData] = await Promise.all([
        api.getAppointments(),
        api.getClients().catch(() => []),
      ]);

      const map = {};
      clientsData.forEach((c) => {
        map[c.client_id] = c;
      });

      setAppointments(aptsData);
      setClientsMap(map);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshIndex]);

  // Filter by status tab & search term
  const filteredAppointments = appointments.filter((apt) => {
    if (activeTab !== 'all' && apt.status?.toLowerCase() !== activeTab) {
      return false;
    }
    const q = searchTerm.toLowerCase();
    const client = clientsMap[apt.client_id];
    const clientName = client?.name?.toLowerCase() || '';
    return (
      apt.appointment_id?.toLowerCase().includes(q) ||
      apt.client_id?.toLowerCase().includes(q) ||
      apt.service_type?.toLowerCase().includes(q) ||
      clientName.includes(q)
    );
  });

  const counts = {
    all: appointments.length,
    pending: appointments.filter((a) => a.status === 'pending').length,
    confirmed: appointments.filter((a) => a.status === 'confirmed').length,
    cancelled: appointments.filter((a) => a.status === 'cancelled').length,
  };

  return (
    <div className="space-y-6 py-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 tracking-tight flex items-center gap-2.5">
            <CalendarCheck2 className="w-6 h-6 text-brand-600" />
            <span>Scheduled Appointments</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse, filter, and track client appointments ({appointments.length} total)
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchData}
            icon={RefreshCw}
            title="Refresh appointments"
          >
            Refresh
          </Button>
          <Link to="/book">
            <Button variant="accent" size="sm" icon={CalendarPlus}>
              Book Appointment
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabs & Search controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-xl overflow-x-auto">
          {[
            { id: 'all', label: 'All', count: counts.all },
            { id: 'pending', label: 'Pending', count: counts.pending },
            { id: 'confirmed', label: 'Confirmed', count: counts.confirmed },
            { id: 'cancelled', label: 'Cancelled', count: counts.cancelled },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-navy-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  activeTab === tab.id ? 'bg-slate-100 text-slate-700' : 'bg-slate-300/60 text-slate-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search ID, client, service..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
          />
        </div>
      </div>

      {/* Main List */}
      {loading ? (
        <Card className="p-4">
          <TableSkeleton rows={5} cols={5} />
        </Card>
      ) : appointments.length === 0 ? (
        <EmptyState
          icon={CalendarCheck2}
          title="No Appointments Booked Yet"
          description="Start by registering a client and booking your first appointment."
          actionText="Book First Appointment"
          actionIcon={CalendarPlus}
          onAction={() => navigate('/book')}
        />
      ) : filteredAppointments.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No Matching Appointments"
          description="Try adjusting your status tab or search filter."
          actionText="Clear Filter"
          onAction={() => {
            setActiveTab('all');
            setSearchTerm('');
          }}
        />
      ) : (
        <Card className="overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold tracking-wider text-[11px]">
                  <th className="py-3 px-4">Appointment ID</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAppointments.map((apt) => {
                  const client = clientsMap[apt.client_id];
                  return (
                    <tr
                      key={apt.appointment_id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-800">
                        {apt.appointment_id}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-navy-900">
                          {client ? client.name : 'Registered Client'}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400">
                          {apt.client_id}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          {apt.service_type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800">
                          {formatDisplayDate(apt.date)}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {formatDisplayTime(apt.time)} ({apt.time})
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={apt.status} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={Eye}
                            onClick={() => setSelectedAppointment(apt)}
                            className="text-xs py-1 px-2"
                          >
                            Details
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Appointment Detail Modal */}
      {selectedAppointment && (
        <Modal
          isOpen={!!selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          title="Appointment Record"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Appointment ID
                  </span>
                  <p className="font-mono text-base font-bold text-navy-900 mt-0.5">
                    {selectedAppointment.appointment_id}
                  </p>
                </div>
                <StatusBadge status={selectedAppointment.status} size="md" />
              </div>

              <div className="pt-2 border-t border-slate-200/60">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Service Requested
                </span>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">
                  {selectedAppointment.service_type}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200/60">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Scheduled Date
                  </span>
                  <p className="text-xs font-medium text-slate-800 mt-0.5">
                    {formatDisplayDate(selectedAppointment.date)}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Scheduled Time
                  </span>
                  <p className="text-xs font-mono font-medium text-slate-800 mt-0.5">
                    {selectedAppointment.time} (24h)
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Client Information
                </span>
                {clientsMap[selectedAppointment.client_id] ? (
                  <div className="mt-1 text-xs text-slate-700 space-y-0.5">
                    <p className="font-bold text-navy-900">
                      {clientsMap[selectedAppointment.client_id].name}
                    </p>
                    <p className="font-mono text-slate-500">
                      ID: {selectedAppointment.client_id}
                    </p>
                    <p>Email: {clientsMap[selectedAppointment.client_id].email}</p>
                    <p>Phone: {clientsMap[selectedAppointment.client_id].phone}</p>
                  </div>
                ) : (
                  <p className="font-mono text-xs text-slate-700 mt-0.5">
                    Client ID: {selectedAppointment.client_id}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center gap-3 pt-2">
              <Link
                to={`/lookup?id=${encodeURIComponent(selectedAppointment.appointment_id)}`}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700"
              >
                Open in Full Lookup Page →
              </Link>
              <Button
                variant="outline"
                size="md"
                onClick={() => setSelectedAppointment(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
