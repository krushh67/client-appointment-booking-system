import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SystemProvider } from './context/SystemContext';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { RegisterClientPage } from './pages/RegisterClientPage';
import { ClientsPage } from './pages/ClientsPage';
import { BookAppointmentPage } from './pages/BookAppointmentPage';
import { AppointmentsPage } from './pages/AppointmentsPage';
import { AppointmentLookupPage } from './pages/AppointmentLookupPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  return (
    <SystemProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="register" element={<RegisterClientPage />} />
            <Route path="clients" element={<ClientsPage />} />
            <Route path="book" element={<BookAppointmentPage />} />
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="lookup" element={<AppointmentLookupPage />} />
            <Route path="admin" element={<AdminDashboardPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SystemProvider>
  );
}

export default App;
