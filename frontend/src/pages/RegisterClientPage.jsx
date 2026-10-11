import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { UserPlus, Sparkles, ArrowRight, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { api } from '../api/client';
import { generateClientId } from '../utils/idGenerator';
import { getIsoTimestamp } from '../utils/dateUtils';
import { useSystem } from '../context/SystemContext';

export const RegisterClientPage = () => {
  const navigate = useNavigate();
  const { triggerGlobalRefresh } = useSystem();

  const [formData, setFormData] = useState({
    client_id: '',
    name: '',
    email: '',
    phone: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [registeredClient, setRegisteredClient] = useState(null);

  // Initialize unique client ID on mount
  useEffect(() => {
    setFormData((prev) => ({ ...prev, client_id: generateClientId() }));
  }, []);

  const handleRegenerateId = () => {
    setFormData((prev) => ({ ...prev, client_id: generateClientId() }));
    if (errors.client_id) {
      setErrors((prev) => ({ ...prev, client_id: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.client_id.trim()) {
      newErrors.client_id = 'Client ID is required';
    } else if (formData.client_id.trim().length < 3) {
      newErrors.client_id = 'Client ID must be at least 3 characters';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Full name must be at least 2 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email address (e.g., alice@example.com)';
    }

    // Phone validation allowing digits, plus, hyphens, parentheses, and spaces
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone.trim())) {
      newErrors.phone = 'Please provide a valid phone number (e.g., +1-555-0199 or 9876543210)';
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
      toast.error('Please fix the errors in the form.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        client_id: formData.client_id.trim(),
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        registered_at: getIsoTimestamp(),
      };

      const result = await api.registerClient(payload);
      toast.success(`Client ${result.name} successfully registered!`);
      setRegisteredClient(result);
      triggerGlobalRefresh();
    } catch (err) {
      toast.error(err.message || 'Registration failed');
      // If error message indicates duplicate ID, highlight the ID field
      if (err.message.toLowerCase().includes('already registered') || err.message.toLowerCase().includes('duplicate')) {
        setErrors((prev) => ({
          ...prev,
          client_id: 'This Client ID is already taken. Click Regenerate for a unique ID.',
        }));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-4 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy-900 tracking-tight flex items-center gap-2.5">
          <UserPlus className="w-6 h-6 text-brand-600" />
          <span>Register New Client</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Add a client record to the system. Once registered, appointments can be scheduled immediately.
        </p>
      </div>

      {/* Success Banner if registered */}
      {registeredClient ? (
        <Card className="border-emerald-200 bg-emerald-50/50 p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-emerald-900">
                Client Registration Complete!
              </h3>
              <p className="text-sm text-emerald-700 mt-0.5">
                <span className="font-semibold">{registeredClient.name}</span> has been stored in memory with ID{' '}
                <code className="bg-emerald-100/80 px-1.5 py-0.5 rounded text-emerald-800 font-mono text-xs font-bold">
                  {registeredClient.client_id}
                </code>
                .
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap gap-3">
            <Button
              variant="accent"
              size="md"
              icon={ArrowRight}
              onClick={() => navigate('/book', { state: { preselectedClientId: registeredClient.client_id } })}
            >
              Proceed to Book Appointment
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => {
                setRegisteredClient(null);
                setFormData({
                  client_id: generateClientId(),
                  name: '',
                  email: '',
                  phone: '',
                });
              }}
            >
              Register Another Client
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="shadow-sm">
          <CardHeader>
            <div>
              <CardTitle>Client Information</CardTitle>
              <CardDescription>
                All fields are required by the backend <code>Client</code> schema.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Client ID */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="client_id" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Client ID <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleRegenerateId}
                    disabled={submitting}
                    className="inline-flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 font-medium"
                    title="Generate another unique ID"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Auto-generate</span>
                  </button>
                </div>
                <input
                  id="client_id"
                  name="client_id"
                  type="text"
                  value={formData.client_id}
                  onChange={handleChange}
                  disabled={submitting}
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm font-mono focus:outline-none focus:ring-2 transition-colors ${
                    errors.client_id
                      ? 'border-rose-300 bg-rose-50/30 focus:ring-rose-200 focus:border-rose-500 text-rose-900'
                      : 'border-slate-300 focus:ring-brand-500/20 focus:border-brand-500 bg-slate-50/50 text-slate-800'
                  }`}
                  placeholder="e.g., client-001"
                />
                {errors.client_id ? (
                  <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{errors.client_id}</span>
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-400 mt-1">
                    Auto-generated unique ID. You may also specify a custom alphanumeric identifier.
                  </p>
                )}
              </div>

              {/* Full Name */}
              <div>
                <label htmlFor="name" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={submitting}
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 transition-colors ${
                    errors.name
                      ? 'border-rose-300 bg-rose-50/30 focus:ring-rose-200 focus:border-rose-500'
                      : 'border-slate-300 focus:ring-brand-500/20 focus:border-brand-500 bg-white'
                  }`}
                  placeholder="e.g., Alice Smith"
                />
                {errors.name && (
                  <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{errors.name}</span>
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={submitting}
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 transition-colors ${
                    errors.email
                      ? 'border-rose-300 bg-rose-50/30 focus:ring-rose-200 focus:border-rose-500'
                      : 'border-slate-300 focus:ring-brand-500/20 focus:border-brand-500 bg-white'
                  }`}
                  placeholder="e.g., alice@example.com"
                />
                {errors.email && (
                  <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phone" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Contact Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={submitting}
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 transition-colors ${
                    errors.phone
                      ? 'border-rose-300 bg-rose-50/30 focus:ring-rose-200 focus:border-rose-500'
                      : 'border-slate-300 focus:ring-brand-500/20 focus:border-brand-500 bg-white'
                  }`}
                  placeholder="e.g., +1-555-0199"
                />
                {errors.phone && (
                  <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{errors.phone}</span>
                  </p>
                )}
              </div>

              <div className="pt-3">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  loading={submitting}
                  disabled={submitting}
                  className="w-full"
                >
                  {submitting ? 'Registering Client...' : 'Register Client'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Directory helper link */}
      <div className="text-center text-xs text-slate-500">
        Looking for existing clients?{' '}
        <Link to="/clients" className="text-brand-600 hover:text-brand-700 font-semibold underline underline-offset-2">
          View Clients Directory
        </Link>
      </div>
    </div>
  );
};
