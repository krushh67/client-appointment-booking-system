"""
Comprehensive Integration Test Suite for main.py (Role S5).

Tests root health check, client registration, appointment booking,
admin status updates, dashboard stats, and error handling.
"""

import pytest
from fastapi import status
from fastapi.testclient import TestClient

from main import app
from routers.clients import clients_db
from routers.appointments import appointments_db


@pytest.fixture(autouse=True)
def reset_db():
    clients_db.clear()
    appointments_db.clear()
    yield
    clients_db.clear()
    appointments_db.clear()


@pytest.fixture
def client():
    return TestClient(app)


def test_health_check(client):
    """GET / returns HTTP 200 and status 'ok'."""
    response = client.get("/")
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {
        "status": "ok",
        "message": "Appointment Booking API is running"
    }


def test_register_client(client):
    """POST /clients registers a new client."""
    payload = {
        "client_id": "c-001",
        "name": "Jane Doe",
        "email": "jane@example.com",
        "phone": "+1-555-0199",
        "registered_at": "2026-10-09T10:00:00Z"
    }
    response = client.post("/clients", json=payload)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["client_id"] == "c-001"


def test_register_duplicate_client(client):
    """POST /clients with same ID returns HTTP 400."""
    payload = {
        "client_id": "c-dup",
        "name": "Jane",
        "email": "jane@example.com",
        "phone": "+1-555-0199",
        "registered_at": "2026-10-09T10:00:00Z"
    }
    client.post("/clients", json=payload)
    dup = client.post("/clients", json=payload)
    assert dup.status_code == status.HTTP_400_BAD_REQUEST


def test_get_all_clients(client):
    """GET /clients returns list of clients."""
    response = client.get("/clients")
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == []


def test_get_client_by_id(client):
    """GET /clients/{id} retrieves existing client."""
    payload = {
        "client_id": "c-lookup",
        "name": "John",
        "email": "john@example.com",
        "phone": "+1-555-0123",
        "registered_at": "2026-10-09T10:00:00Z"
    }
    client.post("/clients", json=payload)
    res = client.get("/clients/c-lookup")
    assert res.status_code == status.HTTP_200_OK
    assert res.json()["name"] == "John"


def test_book_appointment(client):
    """POST /appointments schedules an appointment."""
    client_payload = {
        "client_id": "c-book",
        "name": "John",
        "email": "john@example.com",
        "phone": "+1-555-0123",
        "registered_at": "2026-10-09T10:00:00Z"
    }
    client.post("/clients", json=client_payload)

    apt_payload = {
        "appointment_id": "apt-001",
        "client_id": "c-book",
        "service_type": "Consultation",
        "date": "2026-10-15",
        "time": "14:00"
    }
    res = client.post("/appointments", json=apt_payload)
    assert res.status_code == status.HTTP_200_OK
    assert res.json()["status"] == "pending"


def test_appointment_client_not_found(client):
    """POST /appointments with missing client returns HTTP 404."""
    apt_payload = {
        "appointment_id": "apt-bad",
        "client_id": "c-nonexistent",
        "service_type": "Consultation",
        "date": "2026-10-15",
        "time": "14:00"
    }
    res = client.post("/appointments", json=apt_payload)
    assert res.status_code == status.HTTP_404_NOT_FOUND


def test_admin_dashboard(client):
    """GET /admin/dashboard returns stats."""
    # Register 1 client, book 1 appointment
    c_payload = {
        "client_id": "c-dash",
        "name": "User",
        "email": "u@example.com",
        "phone": "+1-555-9999",
        "registered_at": "2026-10-09T10:00:00Z"
    }
    client.post("/clients", json=c_payload)
    apt_payload = {
        "appointment_id": "apt-dash",
        "client_id": "c-dash",
        "service_type": "Consultation",
        "date": "2026-10-15",
        "time": "10:00"
    }
    client.post("/appointments", json=apt_payload)

    res = client.get("/admin/dashboard")
    assert res.status_code == status.HTTP_200_OK
    data = res.json()
    assert data["total_clients"] == 1
    assert data["total_appointments"] == 1
    assert data["pending_appointments"] == 1


def test_confirm_appointment(client):
    """PUT /admin/appointments/{id}/status updates status."""
    c_payload = {
        "client_id": "c-stat",
        "name": "User",
        "email": "u@example.com",
        "phone": "+1-555-9999",
        "registered_at": "2026-10-09T10:00:00Z"
    }
    client.post("/clients", json=c_payload)
    apt_payload = {
        "appointment_id": "apt-stat",
        "client_id": "c-stat",
        "service_type": "Consultation",
        "date": "2026-10-15",
        "time": "10:00"
    }
    client.post("/appointments", json=apt_payload)

    update_res = client.put(
        "/admin/appointments/apt-stat/status",
        json={"status": "confirmed"}
    )
    assert update_res.status_code == status.HTTP_200_OK
    assert update_res.json()["status"] == "confirmed"
