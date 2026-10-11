/**
 * Date and time helpers conforming to backend contracts:
 * - Client.registered_at: ISO 8601 string
 * - Appointment.date: YYYY-MM-DD string
 * - Appointment.time: HH:MM string (24-hour format)
 */

export const getIsoTimestamp = () => {
  return new Date().toISOString();
};

export const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatDisplayDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
    return dateStr;
  } catch (e) {
    return dateStr;
  }
};

export const formatDisplayTime = (timeStr) => {
  if (!timeStr) return '';
  try {
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours, 10);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const displayHour = h % 12 === 0 ? 12 : h % 12;
    return `${displayHour}:${minutes} ${suffix}`;
  } catch (e) {
    return timeStr;
  }
};

export const formatIsoDateTime = (isoStr) => {
  if (!isoStr) return '';
  try {
    const date = new Date(isoStr);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return isoStr;
  }
};
