"""
Test Suite for Appointment Booking API Module (Role S3).

Validates all appointment booking endpoints, including client existence checks,
duplicate appointment rejection, appointment retrieval, and integration with
the client registration store (`clients_db`).
"""

import pytest
from fastapi import FastAPI, status
from fastapi.testclient import TestClient

from models import Client, Appointment
from routers.clients import router as clients_router, clients_db
from routers.appointments import router as appointments_router, appointments_db


# Instantiate a test application combining client and appointment routers
app = FastAPI(title="Test Appointment Booking System")
app.include_router(clients_router)
app.include_router(appointments_router)


@pytest.fixture(autouse=True)
def clean_databases():
    """Clear in-memory databases before and after every test execution."""
    clients_db.clear()
    appointments_db.clear()
    yield
    clients_db.clear()
    appointments_db.clear()


@pytest.fixture
def registered_client() -> dict:
    """Fixture providing a registered client in clients_db."""
    client_data = {
        "client_id": "client-001",
        "name": "Alice Smith",
        "email": "alice@example.com",
        "phone": "+1-555-0100",
        "registered_at": "2026-10-07T10:00:00Z"
    }
    clients_db[client_data["client_id"]] = Client(**client_data)
    return client_data


@pytest.fixture
def client_api():
    """Fixture providing FastAPI TestClient."""
    return TestClient(app)


def test_book_appointment_success(client_api, registered_client):
    """Verify booking an appointment for an existing client returns HTTP 200 and persisted data."""
    payload = {
        "appointment_id": "apt-101",
        "client_id": registered_client["client_id"],
        "service_type": "Dental Checkup",
        "date": "2026-10-15",
        "time": "14:30",
        "status": "pending"
    }
    response = client_api.post("/appointments", json=payload)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["appointment_id"] == "apt-101"
    assert data["client_id"] == registered_client["client_id"]
    assert data["service_type"] == "Dental Checkup"
    assert data["status"] == "pending"

    # Verify stored in appointments_db
    assert "apt-101" in appointments_db
    assert appointments_db["apt-101"].service_type == "Dental Checkup"


def test_book_appointment_default_status(client_api, registered_client):
    """Verify booking without specifying status defaults to 'pending'."""
    payload = {
        "appointment_id": "apt-102",
        "client_id": registered_client["client_id"],
        "service_type": "Eye Exam",
        "date": "2026-10-16",
        "time": "09:00"
    }
    response = client_api.post("/appointments", json=payload)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["status"] == "pending"


def test_book_appointment_client_not_found(client_api):
    """Verify booking with a non-existent client ID returns HTTP 404."""
    payload = {
        "appointment_id": "apt-999",
        "client_id": "non-existent-client",
        "service_type": "Consultation",
        "date": "2026-10-20",
        "time": "11:00"
    }
    response = client_api.post("/appointments", json=payload)
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert "Client with ID 'non-existent-client' not found" in response.json()["detail"]
    assert "apt-999" not in appointments_db


def test_book_appointment_duplicate_id(client_api, registered_client):
    """Verify booking with a duplicate appointment ID returns HTTP 400."""
    payload = {
        "appointment_id": "apt-dup-01",
        "client_id": registered_client["client_id"],
        "service_type": "Consultation A",
        "date": "2026-10-21",
        "time": "10:00"
    }
    res1 = client_api.post("/appointments", json=payload)
    assert res1.status_code == status.HTTP_200_OK

    # Attempt booking identical appointment ID
    res2 = client_api.post("/appointments", json=payload)
    assert res2.status_code == status.HTTP_400_BAD_REQUEST
    assert "Appointment with ID 'apt-dup-01' already booked" in res2.json()["detail"]


def test_get_all_appointments_empty(client_api):
    """Verify GET /appointments returns an empty list when no appointments exist."""
    response = client_api.get("/appointments")
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == []


def test_get_all_appointments_populated(client_api, registered_client):
    """Verify GET /appointments returns all booked appointments."""
    payload1 = {
        "appointment_id": "apt-multi-1",
        "client_id": registered_client["client_id"],
        "service_type": "Consultation 1",
        "date": "2026-10-22",
        "time": "10:00"
    }
    payload2 = {
        "appointment_id": "apt-multi-2",
        "client_id": registered_client["client_id"],
        "service_type": "Consultation 2",
        "date": "2026-10-23",
        "time": "11:00"
    }
    client_api.post("/appointments", json=payload1)
    client_api.post("/appointments", json=payload2)

    response = client_api.get("/appointments")
    assert response.status_code == status.HTTP_200_OK
    items = response.json()
    assert len(items) == 2
    ids = {item["appointment_id"] for item in items}
    assert ids == {"apt-multi-1", "apt-multi-2"}


def test_get_appointment_by_id_found(client_api, registered_client):
    """Verify GET /appointments/{id} returns the specific appointment details."""
    payload = {
        "appointment_id": "apt-lookup-1",
        "client_id": registered_client["client_id"],
        "service_type": "Full Physical",
        "date": "2026-10-25",
        "time": "15:00"
    }
    client_api.post("/appointments", json=payload)

    response = client_api.get("/appointments/apt-lookup-1")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["appointment_id"] == "apt-lookup-1"
    assert data["service_type"] == "Full Physical"


def test_get_appointment_by_id_not_found(client_api):
    """Verify GET /appointments/{id} for non-existent appointment returns HTTP 404."""
    response = client_api.get("/appointments/unknown-apt")
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert "Appointment with ID 'unknown-apt' not found" in response.json()["detail"]


def test_integration_client_registration_and_booking(client_api):
    """End-to-end integration test: register a client via /clients then book an appointment."""
    # 1. Register client via Client API (S2)
    client_reg_payload = {
        "client_id": "client-integration-01",
        "name": "John Doe",
        "email": "johndoe@example.com",
        "phone": "+1-555-0188",
        "registered_at": "2026-10-07T12:00:00Z"
    }
    reg_res = client_api.post("/clients", json=client_reg_payload)
    assert reg_res.status_code == status.HTTP_200_OK

    # 2. Book appointment using the registered client_id (S3)
    apt_payload = {
        "appointment_id": "apt-integration-01",
        "client_id": "client-integration-01",
        "service_type": "Therapy Session",
        "date": "2026-10-30",
        "time": "16:00"
    }
    book_res = client_api.post("/appointments", json=apt_payload)
    assert book_res.status_code == status.HTTP_200_OK
    assert book_res.json()["client_id"] == "client-integration-01"

    # 3. Verify retrieval
    get_res = client_api.get("/appointments/apt-integration-01")
    assert get_res.status_code == status.HTTP_200_OK
    assert get_res.json()["service_type"] == "Therapy Session"


def test_book_appointment_invalid_payload(client_api, registered_client):
    """Verify booking with missing mandatory fields returns HTTP 422 Unprocessable Entity."""
    # Missing date and time
    invalid_payload = {
        "appointment_id": "apt-invalid",
        "client_id": registered_client["client_id"],
        "service_type": "Physiotherapy"
    }
    response = client_api.post("/appointments", json=invalid_payload)
    assert response.status_code == 422
