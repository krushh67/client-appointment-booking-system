"""
Comprehensive Test Suite for the Client Appointment Booking System (Role S5).

Validates all primary API endpoints across Client Management, Appointment Booking,
and Admin Management modules using FastAPI's TestClient and Pytest.
"""

import pytest
from fastapi.testclient import TestClient

from main import app
from routers.clients import clients_db
from routers.appointments import appointments_db

client = TestClient(app)


@pytest.fixture(autouse=True)
def reset_databases():
    """Clear all in-memory database stores before and after each test execution."""
    clients_db.clear()
    appointments_db.clear()
    yield
    clients_db.clear()
    appointments_db.clear()


def test_health_check():
    """Verify GET / returns HTTP 200 and status 'ok'."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["message"] == "Appointment Booking API is running"


def test_register_client():
    """Verify POST /clients with valid data returns HTTP 200."""
    payload = {
        "client_id": "client-101",
        "name": "Alice Johnson",
        "email": "alice.johnson@example.com",
        "phone": "+1-555-0199",
        "registered_at": "2026-10-07T10:00:00Z"
    }
    response = client.post("/clients", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["client_id"] == "client-101"
    assert data["name"] == "Alice Johnson"
    assert data["email"] == "alice.johnson@example.com"
    assert "client-101" in clients_db


def test_register_duplicate_client():
    """Verify POST /clients with same client_id returns HTTP 400."""
    payload = {
        "client_id": "client-101",
        "name": "Alice Johnson",
        "email": "alice.johnson@example.com",
        "phone": "+1-555-0199",
        "registered_at": "2026-10-07T10:00:00Z"
    }
    initial_res = client.post("/clients", json=payload)
    assert initial_res.status_code == 200

    duplicate_res = client.post("/clients", json=payload)
    assert duplicate_res.status_code == 400
    assert "already registered" in duplicate_res.json()["detail"]


def test_get_all_clients():
    """Verify GET /clients returns HTTP 200."""
    client.post("/clients", json={
        "client_id": "client-101",
        "name": "Alice Johnson",
        "email": "alice.johnson@example.com",
        "phone": "+1-555-0199",
        "registered_at": "2026-10-07T10:00:00Z"
    })
    response = client.get("/clients")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 1
    assert data[0]["client_id"] == "client-101"


def test_get_client_by_id():
    """Verify GET /clients/{client_id} for existing client returns HTTP 200."""
    payload = {
        "client_id": "client-102",
        "name": "Bob Smith",
        "email": "bob.smith@example.com",
        "phone": "+1-555-0122",
        "registered_at": "2026-10-07T11:00:00Z"
    }
    client.post("/clients", json=payload)

    response = client.get(f"/clients/{payload['client_id']}")
    assert response.status_code == 200
    data = response.json()
    assert data["client_id"] == payload["client_id"]
    assert data["name"] == payload["name"]


def test_book_appointment():
    """Verify POST /appointments for an existing client returns HTTP 200."""
    client.post("/clients", json={
        "client_id": "client-101",
        "name": "Alice Johnson",
        "email": "alice.johnson@example.com",
        "phone": "+1-555-0199",
        "registered_at": "2026-10-07T10:00:00Z"
    })

    appointment_payload = {
        "appointment_id": "apt-501",
        "client_id": "client-101",
        "service_type": "Consultation",
        "date": "2026-10-15",
        "time": "14:00",
        "status": "pending"
    }
    response = client.post("/appointments", json=appointment_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["appointment_id"] == "apt-501"
    assert data["client_id"] == "client-101"
    assert data["service_type"] == "Consultation"
    assert "apt-501" in appointments_db


def test_appointment_client_not_found():
    """Verify POST /appointments for a non-existent client returns HTTP 404."""
    appointment_payload = {
        "appointment_id": "apt-999",
        "client_id": "non-existent-client",
        "service_type": "Consultation",
        "date": "2026-10-20",
        "time": "15:00",
        "status": "pending"
    }
    response = client.post("/appointments", json=appointment_payload)
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_admin_dashboard():
    """Verify GET /admin/dashboard returns HTTP 200."""
    client.post("/clients", json={
        "client_id": "client-101",
        "name": "Alice Johnson",
        "email": "alice.johnson@example.com",
        "phone": "+1-555-0199",
        "registered_at": "2026-10-07T10:00:00Z"
    })
    client.post("/appointments", json={
        "appointment_id": "apt-501",
        "client_id": "client-101",
        "service_type": "Consultation",
        "date": "2026-10-15",
        "time": "14:00",
        "status": "pending"
    })

    response = client.get("/admin/dashboard")
    assert response.status_code == 200
    data = response.json()
    assert data["total_clients"] == 1
    assert data["total_appointments"] == 1
    assert data["pending_appointments"] == 1


def test_confirm_appointment():
    """Verify PUT /admin/appointments/{appointment_id}/status with status='confirmed' returns HTTP 200."""
    client.post("/clients", json={
        "client_id": "client-101",
        "name": "Alice Johnson",
        "email": "alice.johnson@example.com",
        "phone": "+1-555-0199",
        "registered_at": "2026-10-07T10:00:00Z"
    })
    client.post("/appointments", json={
        "appointment_id": "apt-501",
        "client_id": "client-101",
        "service_type": "Consultation",
        "date": "2026-10-15",
        "time": "14:00",
        "status": "pending"
    })

    status_payload = {"status": "confirmed"}
    response = client.put("/admin/appointments/apt-501/status", json=status_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["appointment_id"] == "apt-501"
    assert data["status"] == "confirmed"
    assert appointments_db["apt-501"].status == "confirmed"
