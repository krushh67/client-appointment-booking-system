import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Users,
  Search,
  UserPlus,
  CalendarPlus,
  Mail,
  Phone,
  Clock,
  IdCard,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LoadingSpinner, TableSkeleton } from '../components/ui/LoadingSpinner';
import { EmptyState } from '../components/ui/EmptyState';
import { Modal } from '../components/ui/Modal';
import { api } from '../api/client';
import { formatIsoDateTime } from '../utils/dateUtils';
import { useSystem } from '../context/SystemContext';

export const ClientsPage = () => {
  const navigate = useNavigate();
  const { refreshIndex } = useSystem();

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const data = await api.getClients();
      setClients(data);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch registered clients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [refreshIndex]);

  const filteredClients = clients.filter((client) => {
    const q = searchTerm.toLowerCase();
    return (
      client.name?.toLowerCase().includes(q) ||
      client.email?.toLowerCase().includes(q) ||
      client.client_id?.toLowerCase().includes(q) ||
      client.phone?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 py-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-brand-600" />
            <span>Clients Directory</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Registered client accounts in the system ({clients.length} total)
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchClients}
            icon={RefreshCw}
            title="Refresh clients list"
          >
            Refresh
          </Button>
          <Link to="/register">
            <Button variant="accent" size="sm" icon={UserPlus}>
              Register Client
            </Button>
          </Link>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name, email, or client ID..."
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
        />
      </div>

      {/* Content */}
      {loading ? (
        <Card className="p-4">
          <TableSkeleton rows={5} cols={4} />
        </Card>
      ) : clients.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Clients Registered Yet"
          description="Clients must be registered before appointments can be scheduled."
          actionText="Register First Client"
          actionIcon={UserPlus}
          onAction={() => navigate('/register')}
        />
      ) : filteredClients.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No Matching Clients"
          description={`No clients match the search term "${searchTerm}".`}
          actionText="Clear Search"
          onAction={() => setSearchTerm('')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map((client) => (
            <Card
              key={client.client_id}
              hoverable
              className="p-5 flex flex-col justify-between space-y-4"
              onClick={() => setSelectedClient(client)}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-base text-navy-900 line-clamp-1">
                      {client.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <IdCard className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-mono text-xs text-slate-500 font-medium">
                        {client.client_id}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                    Client
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>{client.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Joined {formatIsoDateTime(client.registered_at)}</span>
                  </div>
                </div>
              </div>

              {/* Card Actions */}
              <div
                className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedClient(client)}
                  className="text-xs"
                >
                  View Details
                </Button>
                <Button
                  variant="accent"
                  size="sm"
                  icon={CalendarPlus}
                  className="text-xs"
                  onClick={() =>
                    navigate('/book', { state: { preselectedClientId: client.client_id } })
                  }
                >
                  Book Apt
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Client Details Modal */}
      {selectedClient && (
        <Modal
          isOpen={!!selectedClient}
          onClose={() => setSelectedClient(null)}
          title="Client Profile"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Full Name
                </span>
                <p className="text-base font-bold text-navy-900 mt-0.5">
                  {selectedClient.name}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200/60">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Client ID
                  </span>
                  <p className="font-mono text-xs font-bold text-slate-800 mt-0.5">
                    {selectedClient.client_id}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Registered At
                  </span>
                  <p className="text-xs text-slate-700 mt-0.5">
                    {formatIsoDateTime(selectedClient.registered_at)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200/60">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Email
                  </span>
                  <p className="text-xs text-slate-800 mt-0.5 break-all">
                    {selectedClient.email}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Phone
                  </span>
                  <p className="text-xs text-slate-800 mt-0.5">
                    {selectedClient.phone}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                size="md"
                onClick={() => setSelectedClient(null)}
              >
                Close
              </Button>
              <Button
                variant="accent"
                size="md"
                icon={CalendarPlus}
                onClick={() => {
                  const id = selectedClient.client_id;
                  setSelectedClient(null);
                  navigate('/book', { state: { preselectedClientId: id } });
                }}
              >
                Book Appointment for {selectedClient.name.split(' ')[0]}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
