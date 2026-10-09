# AppointmentHub Frontend

**AppointmentHub** is a responsive, modern web application for the Client Appointment Booking System built with React, Vite, and Tailwind CSS. It communicates directly with the FastAPI backend at `http://localhost:8000`.

---

## Features

- **Home Overview**: Live backend connectivity monitor, quick metrics preview, and guided navigation.
- **Client Registration**: Schema-compliant client registration with collision-resistant auto-generated IDs, ISO timestamp creation, and instant redirection to scheduling.
- **Clients Directory**: Searchable list of registered clients with detail modal and 1-click booking shortcut.
- **Appointment Booking**: Referential-integrity booking form with registered client lookup, service presets, calendar date restriction, and time slot selector.
- **Appointments Directory**: Table view of scheduled appointments with client enrichment and status tabs (`All`, `Pending`, `Confirmed`, `Cancelled`).
- **Appointment Lookup**: Direct search by Appointment ID with printable confirmation receipt card.
- **Admin Dashboard**: System-wide statistics, status workflow updates (`pending` → `confirmed` / `cancelled`), and record deletion with confirmation modals.

---

## Getting Started

### 1. Start the FastAPI Backend

In the root of `client-appointment-booking-system`:

```bash
# Ensure dependencies are installed
pip install -r requirements.txt

# Start FastAPI server on port 8000
uvicorn main:app --reload --port 8000
```

The API will be available at:
- **API Base**: `http://localhost:8000`
- **Interactive Swagger Docs**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### 2. Start the Frontend Development Server

In the `frontend` directory:

```bash
# Install dependencies (if not already installed)
npm install

# Start Vite dev server
npm run dev
```

Open `http://localhost:5173` in your browser.

### 3. Build for Production

```bash
npm run build
```

This generates an optimized production build in `dist/`.
