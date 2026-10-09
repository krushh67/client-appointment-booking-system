import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  CalendarPlus,
  User,
  Calendar as CalendarIcon,
  Clock,
  Sparkles,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  UserPlus,
  Briefcase,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { api } from '../api/client';
import { generateAppointmentId } from '../utils/idGenerator';
import { getTodayDateString, formatDisplayDate } from '../utils/dateUtils';
import { useSystem } from '../context/SystemContext';

const PRESET_SERVICES = [
  'General Consultation',
  'Dental Checkup',
  'Eye Examination',
  'Physical Therapy',
  'Specialist Consultation',
  'Follow-up Review',
];

const PRESET_TIME_SLOTS = [
  '09:00',
  '10:00',
  '11:00',
  '11:30',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
];

export const BookAppointmentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { triggerGlobalRefresh } = useSystem();

  const [clients, setClients] = useState([]);
  const [loadingClients, setLoadingClients] = useState(true);

  const [formData, setFormData] = useState({
    appointment_id: '',
    client_id: location.state?.preselectedClientId || '',
    service_type: 'General Consultation',
    custom_service: '',
    date: getTodayDateString(),
    time: '10:00',
    status: 'pending',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [bookedAppointment, setBookedAppointment] = useState(null);

  // Initialize Appointment ID
  useEffect(() => {
    setFormData((prev) => ({ ...prev, appointment_id: generateAppointmentId() }));
  }, []);

  // Fetch registered clients so user can select an existing client
  useEffect(() => {
    let isMounted = true;
    const loadClients = async () => {
      try {
        const data = await api.getClients();
        if (isMounted) {
          setClients(data);
          // If preselectedClientId passed via state, make sure it is selected
          if (location.state?.preselectedClientId) {
            setFormData((prev) => ({ ...prev, client_id: location.state.preselectedClientId }));
          } else if (data.length > 0 && !formData.client_id) {
            setFormData((prev) => ({ ...prev, client_id: data[0].client_id }));
          }
        }
      } catch (e) {
        toast.error('Failed to load registered clients for appointment selection');
      } finally {
        if (isMounted) setLoadingClients(false);
      }
    };
    loadClients();
    return () => {
      isMounted = false;
    };
  }, [location.state]);

  const handleRegenerateId = () => {
    setFormData((prev) => ({ ...prev, appointment_id: generateAppointmentId() }));
    if (errors.appointment_id) {
      setErrors((prev) => ({ ...prev, appointment_id: null }));
    }
  };

  const selectedClientObject = clients.find((c) => c.client_id === formData.client_id);

  const validate = () => {
    const newErrors = {};

    if (!formData.appointment_id.trim()) {
      newErrors.appointment_id = 'Appointment ID is required';
    }

    if (!formData.client_id.trim()) {
      newErrors.client_id = 'A registered Client ID is required';
    }

    const service =
      formData.service_type === 'Other'
        ? formData.custom_service.trim()
        : formData.service_type.trim();

    if (!service) {
      newErrors.service_type = 'Please select or provide a service type';
    }

    if (!formData.date.trim()) {
      newErrors.date = 'Appointment date is required (YYYY-MM-DD)';
    }

    if (!formData.time.trim()) {
      newErrors.time = 'Appointment time is required (HH:MM)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix the errors before scheduling.');
      return;
    }

    setSubmitting(true);
    try {
      const finalService =
        formData.service_type === 'Other'
          ? formData.custom_service.trim()
          : formData.service_type.trim();

      const payload = {
        appointment_id: formData.appointment_id.trim(),
        client_id: formData.client_id.trim(),
        service_type: finalService,
        date: formData.date.trim(),
        time: formData.time.trim(),
        status: formData.status || 'pending',
      };

      const result = await api.bookAppointment(payload);
      toast.success(`Appointment ${result.appointment_id} booked successfully!`);
      setBookedAppointment(result);
      triggerGlobalRefresh();
    } catch (err) {
      toast.error(err.message || 'Failed to book appointment');
      if (err.message.toLowerCase().includes('already booked')) {
        setErrors((prev) => ({
          ...prev,
          appointment_id: 'This Appointment ID is already in use. Click Auto-generate.',
        }));
      } else if (err.message.toLowerCase().includes('client') && err.message.toLowerCase().includes('not found')) {
        setErrors((prev) => ({
          ...prev,
          client_id: 'Referenced client does not exist in backend database. Register client first.',
        }));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-4 space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-navy-900 tracking-tight flex items-center gap-2.5">
          <CalendarPlus className="w-6 h-6 text-brand-600" />
          <span>Book an Appointment</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Schedule an appointment for a registered client with verified ID checks.
        </p>
      </div>

      {/* Success View */}
      {bookedAppointment ? (
        <Card className="border-emerald-200 bg-emerald-50/50 p-6 space-y-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-emerald-900">
                Appointment Successfully Scheduled!
              </h3>
              <p className="text-sm text-emerald-700 mt-0.5">
                Appointment record <code className="font-mono font-bold text-emerald-900 bg-emerald-100 px-1 py-0.5 rounded">{bookedAppointment.appointment_id}</code> has been confirmed in the system.
              </p>
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-emerald-200/80 space-y-2 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-slate-400 uppercase font-semibold">Service:</span>
                <p className="font-bold text-slate-800 text-sm mt-0.5">{bookedAppointment.service_type}</p>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-semibold">Client ID:</span>
                <p className="font-mono font-bold text-slate-800 text-sm mt-0.5">{bookedAppointment.client_id}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <span className="text-slate-400 uppercase font-semibold">Date:</span>
                <p className="font-bold text-slate-800 mt-0.5">{formatDisplayDate(bookedAppointment.date)}</p>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-semibold">Time:</span>
                <p className="font-bold text-slate-800 mt-0.5">{bookedAppointment.time} (24h)</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              variant="accent"
              size="md"
              icon={ArrowRight}
              onClick={() => navigate('/appointments')}
            >
              View in Appointments List
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => {
                setBookedAppointment(null);
                setFormData((prev) => ({
                  ...prev,
                  appointment_id: generateAppointmentId(),
                }));
              }}
            >
              Book Another Appointment
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="shadow-sm">
          <CardHeader>
            <div>
              <CardTitle>Appointment Details</CardTitle>
              <CardDescription>
                Select an existing client, choose your desired service, date, and time slot.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Step 1: Client Selection */}
              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="client_id" className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-brand-600" />
                    <span>Select Client <span className="text-rose-500">*</span></span>
                  </label>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 font-semibold"
                  >
                    <UserPlus className="w-3 h-3" />
                    <span>+ Register New Client</span>
                  </Link>
                </div>

                {loadingClients ? (
                  <p className="text-xs text-slate-500 py-2">Loading client database...</p>
                ) : clients.length === 0 ? (
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-800 space-y-2">
                    <div className="flex items-center gap-1.5 font-semibold">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <span>No registered clients found in the backend!</span>
                    </div>
                    <p>
                      The appointment booking API requires an existing client ID in <code>clients_db</code>. Please register a client before proceeding.
                    </p>
                    <Link to="/register">
                      <Button variant="accent" size="sm" icon={UserPlus} className="mt-1">
                        Register Client Now
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div>
                    <select
                      id="client_id"
                      name="client_id"
                      value={formData.client_id}
                      onChange={handleChange}
                      disabled={submitting}
                      className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-white focus:outline-none focus:ring-2 transition-colors ${
                        errors.client_id
                          ? 'border-rose-300 focus:ring-rose-200 focus:border-rose-500'
                          : 'border-slate-300 focus:ring-brand-500/20 focus:border-brand-500'
                      }`}
                    >
                      <option value="">-- Choose a registered client --</option>
                      {clients.map((c) => (
                        <option key={c.client_id} value={c.client_id}>
                          {c.name} ({c.client_id}) — {c.phone}
                        </option>
                      ))}
                    </select>

                    {/* Verified Client Info Badge */}
                    {selectedClientObject && (
                      <div className="mt-2.5 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-800">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <span>
                            Verified: <strong>{selectedClientObject.name}</strong> ({selectedClientObject.email})
                          </span>
                        </div>
                        <span className="font-mono text-[11px] text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded">
                          {selectedClientObject.client_id}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {errors.client_id && (
                  <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{errors.client_id}</span>
                  </p>
                )}
              </div>

              {/* Step 2: Appointment ID */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="appointment_id" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Appointment ID <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleRegenerateId}
                    disabled={submitting}
                    className="inline-flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 font-medium"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Auto-generate</span>
                  </button>
                </div>
                <input
                  id="appointment_id"
                  name="appointment_id"
                  type="text"
                  value={formData.appointment_id}
                  onChange={handleChange}
                  disabled={submitting}
                  className={`w-full px-3.5 py-2.5 rounded-lg border font-mono text-sm focus:outline-none focus:ring-2 transition-colors ${
                    errors.appointment_id
                      ? 'border-rose-300 bg-rose-50/30 text-rose-900 focus:ring-rose-200 focus:border-rose-500'
                      : 'border-slate-300 bg-slate-50/50 text-slate-800 focus:ring-brand-500/20 focus:border-brand-500'
                  }`}
                  placeholder="e.g., apt-101"
                />
                {errors.appointment_id && (
                  <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{errors.appointment_id}</span>
                  </p>
                )}
              </div>

              {/* Step 3: Service Type */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-brand-600" />
                  <span>Service Type <span className="text-rose-500">*</span></span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PRESET_SERVICES.map((srv) => (
                    <button
                      key={srv}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, service_type: srv }))}
                      className={`px-3 py-2 rounded-lg text-xs font-medium text-left transition-all border ${
                        formData.service_type === srv
                          ? 'border-navy-900 bg-navy-900 text-white shadow-sm'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {srv}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, service_type: 'Other' }))}
                    className={`px-3 py-2 rounded-lg text-xs font-medium text-left transition-all border ${
                      formData.service_type === 'Other'
                        ? 'border-navy-900 bg-navy-900 text-white shadow-sm'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    + Custom Service...
                  </button>
                </div>

                {formData.service_type === 'Other' && (
                  <div className="mt-2">
                    <input
                      type="text"
                      name="custom_service"
                      value={formData.custom_service}
                      onChange={handleChange}
                      placeholder="Enter custom service name (e.g., Cardiac Ultrasound)"
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    />
                  </div>
                )}
                {errors.service_type && (
                  <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{errors.service_type}</span>
                  </p>
                )}
              </div>

              {/* Step 4: Date & Time Picker */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Date */}
                <div>
                  <label htmlFor="date" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Appointment Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    min={getTodayDateString()}
                    value={formData.date}
                    onChange={handleChange}
                    disabled={submitting}
                    className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-white focus:outline-none focus:ring-2 transition-colors ${
                      errors.date
                        ? 'border-rose-300 focus:ring-rose-200 focus:border-rose-500'
                        : 'border-slate-300 focus:ring-brand-500/20 focus:border-brand-500'
                    }`}
                  />
                  {errors.date && (
                    <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{errors.date}</span>
                    </p>
                  )}
                </div>

                {/* Time */}
                <div>
                  <label htmlFor="time" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Appointment Time (HH:MM) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="time"
                    name="time"
                    type="time"
                    value={formData.time}
                    onChange={handleChange}
                    disabled={submitting}
                    className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-white focus:outline-none focus:ring-2 transition-colors ${
                      errors.time
                        ? 'border-rose-300 focus:ring-rose-200 focus:border-rose-500'
                        : 'border-slate-300 focus:ring-brand-500/20 focus:border-brand-500'
                    }`}
                  />
                  {errors.time && (
                    <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{errors.time}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Quick Time Slots Selection */}
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Quick Time Slot Presets:
                </p>
                <div className="flex flex-wrap gap-2">
                  {PRESET_TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, time: slot }))}
                      className={`px-2.5 py-1 rounded text-xs font-medium transition-colors border ${
                        formData.time === slot
                          ? 'border-brand-600 bg-brand-50 text-brand-700 font-bold'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-slate-100">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  loading={submitting}
                  disabled={submitting || clients.length === 0}
                  className="w-full"
                >
                  {submitting ? 'Confirming Appointment...' : 'Schedule Appointment'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
