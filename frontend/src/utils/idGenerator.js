/**
 * ID generator utilities for Client Appointment Booking System.
 * Generates human-friendly, unique IDs compatible with the backend's string ID schemas.
 */

export const generateClientId = () => {
  const timestamp = Date.now().toString(36).slice(-4);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `client-${timestamp}-${random}`;
};

export const generateAppointmentId = () => {
  const timestamp = Date.now().toString(36).slice(-4);
  const random = Math.floor(100 + Math.random() * 900);
  return `apt-${timestamp}-${random}`;
};
