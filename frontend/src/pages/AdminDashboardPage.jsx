import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  ShieldAlert,
  Users,
  CalendarCheck2,
  Clock,
  CheckCircle2,
  XCircle,
  Trash2,
  RefreshCw,
  AlertTriangle,
  Info,
  Server,
  Edit3,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Modal } from '../components/ui/Modal';
import { api } from '../api/client';
import { formatDisplayDate, formatDisplayTime } from '../utils/dateUtils';
import { useSystem } from '../context/SystemContext';

export const AdminDashboardPage = () => {
  const { refreshIndex, triggerGlobalRefresh } = useSystem();

  const [stats, setStats] = useState({
    total_clients: 0,
    total_appointments: 0,
    pending_appointments: 0,
    confirmed_appointments: 0,
    cancelled_appointments: 0,
  });

  const [appointments, setAppointments] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Status Change State
  const [statusModalApt, setStatusModalApt] = useState(null);
  const [newStatus, setNewStatus] = useState('confirmed');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Delete Appointment State
  const [deleteAptId, setDeleteAptId] = useState(null);
  const [deletingApt, setDeletingApt] = useState(false);

  // Delete Client State
  const [deleteClientId, setDeleteClientId] = useState(null);
  const [deletingClient, setDeletingClient] = useState(false);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [dashStats, aptsList, clientsList] = await Promise.all([
        api.getAdminDashboard(),
        api.getAppointments().catch(() => []),
        api.getClients().catch(() => []),
      ]);

      setStats(dashStats);
      setAppointments(aptsList);
      setClients(clientsList);
    } catch (err) {
      toast.error(err.message || 'Failed to load administrative data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [refreshIndex]);

  const handleUpdateStatus = async () => {
    if (!statusModalApt) return;
    setUpdatingStatus(true);
    try {
      await api.updateAppointmentStatus(statusModalApt.appointment_id, newStatus);
      toast.success(`Appointment status updated to ${newStatus}`);
      setStatusModalApt(null);
      triggerGlobalRefresh();
    } catch (err) {
      toast.error(err.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDeleteAppointment = async () => {
    if (!deleteAptId) return;
    setDeletingApt(true);
    try {
      await api.deleteAppointment(deleteAptId);
      toast.success(`Appointment ${deleteAptId} deleted`);
      setDeleteAptId(null);
      triggerGlobalRefresh();
    } catch (err) {
      toast.error(err.message || 'Failed to delete appointment');
    } finally {
      setDeletingApt(false);
    }
  };

  const handleDeleteClient = async () => {
    if (!deleteClientId) return;
    setDeletingClient(true);
    try {
      await api.deleteClient(deleteClientId);
      toast.success(`Client ${deleteClientId} deleted`);
      setDeleteClientId(null);
      triggerGlobalRefresh();
    } catch (err) {
      toast.error(err.message || 'Failed to delete client');
    } finally {
      setDeletingClient(false);
    }
  };

  return (
    <div className="space-y-8 py-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 tracking-tight flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 text-amber-500" />
            <span>Admin Management & Metrics</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            System health, in-memory database records, and appointment lifecycle controls.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchAdminData}
          icon={RefreshCw}
          title="Refresh metrics"
        >
          Refresh Data
        </Button>
      </div>

      {/* Architecture & Security Notice (Mandatory from Phase 1/3 guidelines) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block">No Backend Authentication</span>
            <p className="text-amber-800 leading-relaxed">
              This administrative portal operates directly over the REST endpoints without JWT/OAuth credentials. In accordance with system design constraints, authentication has not been mocked or fabricated.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-900 text-xs flex items-start gap-3">
          <Server className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block">In-Memory Runtime Storage</span>
            <p className="text-blue-800 leading-relaxed">
              The backend stores client and appointment records inside in-memory Python dictionaries (<code>clients_db</code> and <code>appointments_db</code>). Records persist during process uptime and reset on restart.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      {loading ? (
        <Card className="p-6">
          <LoadingSpinner text="Loading system metrics..." />
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Total Clients */}
          <Card className="p-4 bg-white">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Clients</span>
              <Users className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-navy-900 mt-2">{stats.total_clients}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Registered</p>
          </Card>

          {/* Total Appointments */}
          <Card className="p-4 bg-white">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Appointments</span>
              <CalendarCheck2 className="w-4 h-4 text-brand-600" />
            </div>
            <p className="text-2xl font-bold text-navy-900 mt-2">{stats.total_appointments}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Total scheduled</p>
          </Card>

          {/* Pending */}
          <Card className="p-4 bg-white">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Pending</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl font-bold text-amber-600 mt-2">{stats.pending_appointments}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Awaiting action</p>
          </Card>

          {/* Confirmed */}
          <Card className="p-4 bg-white">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Confirmed</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-2xl font-bold text-emerald-600 mt-2">{stats.confirmed_appointments}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Approved</p>
          </Card>

          {/* Cancelled */}
          <Card className="p-4 bg-white col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Cancelled</span>
              <XCircle className="w-4 h-4 text-rose-500" />
            </div>
            <p className="text-2xl font-bold text-rose-600 mt-2">{stats.cancelled_appointments}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Revoked</p>
          </Card>
        </div>
      )}

      {/* Manage Appointments Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <div>
            <CardTitle>Manage Appointments</CardTitle>
            <CardDescription>
              Update appointment workflow states (Pending → Confirmed / Cancelled) or delete records.
            </CardDescription>
          </div>
        </CardHeader>

        <div className="overflow-x-auto">
          {appointments.length === 0 ? (
            <p className="p-8 text-center text-xs text-slate-400">
              No appointments available to manage in <code>appointments_db</code>.
            </p>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold tracking-wider text-[11px]">
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Client ID</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Schedule</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appointments.map((apt) => (
                  <tr key={apt.appointment_id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-mono font-medium text-slate-800">
                      {apt.appointment_id}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">{apt.client_id}</td>
                    <td className="py-3 px-4 font-medium text-slate-700">{apt.service_type}</td>
                    <td className="py-3 px-4 text-slate-600">
                      {formatDisplayDate(apt.date)} @ {apt.time}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={apt.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          icon={Edit3}
                          onClick={() => {
                            setStatusModalApt(apt);
                            setNewStatus(apt.status === 'confirmed' ? 'cancelled' : 'confirmed');
                          }}
                          className="text-xs py-1 px-2"
                        >
                          Status
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={Trash2}
                          onClick={() => setDeleteAptId(apt.appointment_id)}
                          className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 py-1 px-2"
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      {/* Manage Clients Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <div>
            <CardTitle>Manage Clients</CardTitle>
            <CardDescription>
              Registered client records and account deletion.
            </CardDescription>
          </div>
        </CardHeader>

        <div className="overflow-x-auto">
          {clients.length === 0 ? (
            <p className="p-8 text-center text-xs text-slate-400">
              No clients found in <code>clients_db</code>.
            </p>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold tracking-wider text-[11px]">
                  <th className="py-3 px-4">Client ID</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {clients.map((c) => (
                  <tr key={c.client_id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-mono font-medium text-slate-800">
                      {c.client_id}
                    </td>
                    <td className="py-3 px-4 font-semibold text-navy-900">{c.name}</td>
                    <td className="py-3 px-4 text-slate-600">{c.email}</td>
                    <td className="py-3 px-4 text-slate-600">{c.phone}</td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Trash2}
                        onClick={() => setDeleteClientId(c.client_id)}
                        className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 py-1 px-2"
                      >
                        Delete Client
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      {/* Update Status Modal */}
      {statusModalApt && (
        <Modal
          isOpen={!!statusModalApt}
          onClose={() => setStatusModalApt(null)}
          title="Update Appointment Status"
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-600">
              Select the new status for appointment{' '}
              <code className="font-mono font-bold text-navy-900 bg-slate-100 px-1 py-0.5 rounded">
                {statusModalApt.appointment_id}
              </code>{' '}
              (Current: <span className="capitalize font-semibold">{statusModalApt.status}</span>):
            </p>

            <div className="grid grid-cols-3 gap-2">
              {['pending', 'confirmed', 'cancelled'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setNewStatus(st)}
                  className={`p-3 rounded-lg border text-xs font-semibold capitalize transition-all ${
                    newStatus === st
                      ? 'border-navy-900 bg-navy-900 text-white shadow-sm'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="flex justify-end gap-2.5 pt-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => setStatusModalApt(null)}
                disabled={updatingStatus}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleUpdateStatus}
                loading={updatingStatus}
                disabled={updatingStatus}
              >
                Save Status
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Confirm Delete Appointment Modal */}
      {deleteAptId && (
        <Modal
          isOpen={!!deleteAptId}
          onClose={() => setDeleteAptId(null)}
          title="Confirm Appointment Deletion"
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete appointment record{' '}
              <code className="font-mono font-bold text-rose-600 bg-rose-50 px-1 py-0.5 rounded">
                {deleteAptId}
              </code>
              ? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-2.5 pt-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => setDeleteAptId(null)}
                disabled={deletingApt}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="md"
                onClick={handleDeleteAppointment}
                loading={deletingApt}
                disabled={deletingApt}
              >
                Delete Record
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Confirm Delete Client Modal */}
      {deleteClientId && (
        <Modal
          isOpen={!!deleteClientId}
          onClose={() => setDeleteClientId(null)}
          title="Confirm Client Deletion"
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete client record{' '}
              <code className="font-mono font-bold text-rose-600 bg-rose-50 px-1 py-0.5 rounded">
                {deleteClientId}
              </code>
              ? All associated appointments for this client will also be removed from memory.
            </p>

            <div className="flex justify-end gap-2.5 pt-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => setDeleteClientId(null)}
                disabled={deletingClient}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="md"
                onClick={handleDeleteClient}
                loading={deletingClient}
                disabled={deletingClient}
              >
                Delete Client
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
