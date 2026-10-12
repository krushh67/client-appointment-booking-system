"""
Comprehensive Integration Test Suite for the Client Appointment Booking System.

Tests the root health check, client registration and retrieval,
appointment booking, admin status updates, dashboard statistics,
and error handling.
"""

import pytest
from fastapi.testclient import TestClient

from main import app
from routers.clients import clients_db
from routers.appointments import appointments_db


client = TestClient(app)


@pytest.fixture(autouse=True)
def reset_databases():
    """Clear in-memory database stores before and after each test."""
    clients_db.clear()
    appointments_db.clear()

    yield

    clients_db.clear()
    appointments_db.clear()


def test_health_check():
    """GET / returns HTTP 200 and the API health status."""
    response = client.get("/")

    assert response.status_code == 200
    assert response.json() == {
        "status": "ok",
        "message": "Appointment Booking API is running",
    }


def test_register_client():
    """POST /clients registers a new client."""
    payload = {
        "client_id": "client-101",
        "name": "Alice Johnson",
        "email": "alice.johnson@example.com",
        "phone": "+1-555-0199",
        "registered_at": "2026-10-07T10:00:00Z",
    }

    response = client.post("/clients", json=payload)

    assert response.status_code == 200
    assert response.json()["client_id"] == "client-101"
    assert response.json()["name"] == "Alice Johnson"
    assert "client-101" in clients_db


def test_register_duplicate_client():
    """Registering the same client ID twice returns HTTP 400."""
    payload = {
        "client_id": "client-101",
        "name": "Alice Johnson",
        "email": "alice.johnson@example.com",
        "phone": "+1-555-0199",
        "registered_at": "2026-10-07T10:00:00Z",
    }

    first_response = client.post("/clients", json=payload)
    duplicate_response = client.post("/clients", json=payload)

    assert first_response.status_code == 200
    assert duplicate_response.status_code == 400


def test_get_all_clients():
    """GET /clients returns the registered clients."""
    payload = {
        "client_id": "client-101",
        "name": "Alice Johnson",
        "email": "alice.johnson@example.com",
        "phone": "+1-555-0199",
        "registered_at": "2026-10-07T10:00:00Z",
    }
    client.post("/clients", json=payload)

    response = client.get("/clients")

    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) == 1
    assert response.json()[0]["client_id"] == "client-101"


def test_get_client_by_id():
    """GET /clients/{client_id} retrieves an existing client."""
    payload = {
        "client_id": "client-102",
        "name": "Bob Smith",
        "email": "bob.smith@example.com",
        "phone": "+1-555-0122",
        "registered_at": "2026-10-07T11:00:00Z",
    }
    client.post("/clients", json=payload)

    response = client.get("/clients/client-102")

    assert response.status_code == 200
    assert response.json()["client_id"] == "client-102"
    assert response.json()["name"] == "Bob Smith"


def test_book_appointment():
    """POST /appointments books an appointment for an existing client."""
    client_payload = {
        "client_id": "client-101",
        "name": "Alice Johnson",
        "email": "alice.johnson@example.com",
        "phone": "+1-555-0199",
        "registered_at": "2026-10-07T10:00:00Z",
    }
    client.post("/clients", json=client_payload)

    appointment_payload = {
        "appointment_id": "apt-501",
        "client_id": "client-101",
        "service_type": "Consultation",
        "date": "2026-10-15",
        "time": "14:00",
    }

    response = client.post("/appointments", json=appointment_payload)

    assert response.status_code == 200
    assert response.json()["appointment_id"] == "apt-501"
    assert response.json()["client_id"] == "client-101"
    assert response.json()["status"] == "pending"
    assert "apt-501" in appointments_db


def test_appointment_client_not_found():
    """Booking an appointment for a missing client returns HTTP 404."""
    appointment_payload = {
        "appointment_id": "apt-999",
        "client_id": "non-existent-client",
        "service_type": "Consultation",
        "date": "2026-10-20",
        "time": "15:00",
    }

    response = client.post("/appointments", json=appointment_payload)

    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_admin_dashboard():
    """GET /admin/dashboard returns correct dashboard statistics."""
    client_payload = {
        "client_id": "client-101",
        "name": "Alice Johnson",
        "email": "alice.johnson@example.com",
        "phone": "+1-555-0199",
        "registered_at": "2026-10-07T10:00:00Z",
    }
    client.post("/clients", json=client_payload)

    appointment_payload = {
        "appointment_id": "apt-501",
        "client_id": "client-101",
        "service_type": "Consultation",
        "date": "2026-10-15",
        "time": "14:00",
    }
    client.post("/appointments", json=appointment_payload)

    response = client.get("/admin/dashboard")

    assert response.status_code == 200
    data = response.json()
    assert data["total_clients"] == 1
    assert data["total_appointments"] == 1
    assert data["pending_appointments"] == 1


def test_confirm_appointment():
    """Updating an appointment status to confirmed returns HTTP 200."""
    client_payload = {
        "client_id": "client-101",
        "name": "Alice Johnson",
        "email": "alice.johnson@example.com",
        "phone": "+1-555-0199",
        "registered_at": "2026-10-07T10:00:00Z",
    }
    client.post("/clients", json=client_payload)

    appointment_payload = {
        "appointment_id": "apt-501",
        "client_id": "client-101",
        "service_type": "Consultation",
        "date": "2026-10-15",
        "time": "14:00",
    }
    client.post("/appointments", json=appointment_payload)

    response = client.put(
        "/admin/appointments/apt-501/status",
        json={"status": "confirmed"},
    )

    assert response.status_code == 200
    assert response.json()["appointment_id"] == "apt-501"
    assert response.json()["status"] == "confirmed"
    assert appointments_db["apt-501"].status == "confirmed"