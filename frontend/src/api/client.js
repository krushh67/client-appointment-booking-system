/**
 * Axios API client and endpoints integration for AppointmentHub.
 * Configured with baseURL http://localhost:8000 (FastAPI backend).
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
});

// Response interceptor to normalize error messages
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'An unexpected error occurred.';
    if (error.response) {
      if (typeof error.response.data?.detail === 'string') {
        message = error.response.data.detail;
      } else if (Array.isArray(error.response.data?.detail)) {
        // Pydantic validation error array
        message = error.response.data.detail.map(d => `${d.loc?.join('.')}: ${d.msg}`).join(', ');
      } else if (error.response.data?.message) {
        message = error.response.data.message;
      } else {
        message = `Server responded with error ${error.response.status}`;
      }
    } else if (error.request) {
      message = 'Cannot connect to backend server. Please verify FastAPI is running at http://localhost:8000';
    } else {
      message = error.message;
    }
    return Promise.reject(new Error(message));
  }
);

// API Service Methods
export const api = {
  // System Health
  async getHealth() {
    try {
      const res = await apiClient.get('/');
      return res.data;
    } catch (e) {
      // In case / is not responding but /clients is
      return { status: 'error', message: e.message };
    }
  },

  // Clients API (Role S2)
  async getClients() {
    const res = await apiClient.get('/clients');
    return res.data;
  },

  async getClientById(clientId) {
    const res = await apiClient.get(`/clients/${encodeURIComponent(clientId)}`);
    return res.data;
  },

  async registerClient(clientData) {
    const res = await apiClient.post('/clients', clientData);
    return res.data;
  },

  // Appointments API (Role S3)
  async getAppointments() {
    const res = await apiClient.get('/appointments');
    return res.data;
  },

  async getAppointmentById(appointmentId) {
    const res = await apiClient.get(`/appointments/${encodeURIComponent(appointmentId)}`);
    return res.data;
  },

  async bookAppointment(appointmentData) {
    const res = await apiClient.post('/appointments', appointmentData);
    return res.data;
  },

  // Admin Management API (Role S4)
  async updateAppointmentStatus(appointmentId, status) {
    const res = await apiClient.put(`/admin/appointments/${encodeURIComponent(appointmentId)}/status`, {
      status,
    });
    return res.data;
  },

  async deleteAppointment(appointmentId) {
    const res = await apiClient.delete(`/admin/appointments/${encodeURIComponent(appointmentId)}`);
    return res.data;
  },

  async deleteClient(clientId) {
    const res = await apiClient.delete(`/admin/clients/${encodeURIComponent(clientId)}`);
    return res.data;
  },

  async getAdminDashboard() {
    try {
      const res = await apiClient.get('/admin/dashboard');
      return res.data;
    } catch (e) {
      // Fallback: If /admin/dashboard endpoint is not present, calculate metrics from client and appointment lists
      const [clients, appointments] = await Promise.all([
        apiClient.get('/clients').then(r => r.data).catch(() => []),
        apiClient.get('/appointments').then(r => r.data).catch(() => []),
      ]);

      return {
        total_clients: clients.length,
        total_appointments: appointments.length,
        pending_appointments: appointments.filter(a => a.status === 'pending').length,
        confirmed_appointments: appointments.filter(a => a.status === 'confirmed').length,
        cancelled_appointments: appointments.filter(a => a.status === 'cancelled').length,
      };
    }
  },
};
