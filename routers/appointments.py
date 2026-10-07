"""
Appointment Booking API Router.

This module provides RESTful endpoints for booking and retrieving appointments.
It validates client existence against `clients_db` from the client registration
module (S2) and maintains an in-memory appointment data store (`appointments_db`).
"""

from fastapi import APIRouter, HTTPException, status
from models import Appointment, StatusUpdate
from routers.clients import clients_db

__all__ = ["router", "appointments_db"]

router = APIRouter(prefix="/appointments", tags=["Appointments"])

# In-memory store for appointment records: key is appointment_id, value is Appointment instance
appointments_db: dict[str, Appointment] = {}


@router.post(
    "",
    response_model=Appointment,
    status_code=status.HTTP_200_OK,
    summary="Book a new appointment",
    responses={
        200: {"description": "Appointment successfully booked"},
        400: {"description": "Duplicate appointment ID provided"},
        404: {"description": "Referenced client ID does not exist"}
    }
)
@router.post(
    "/",
    response_model=Appointment,
    status_code=status.HTTP_200_OK,
    include_in_schema=False
)
def book_appointment(appointment: Appointment) -> Appointment:
    """
    Book a new appointment for an existing client.

    Validates that:
    1. The client associated with `client_id` is registered in `clients_db`.
    2. The `appointment_id` has not already been used.

    - **appointment_id**: Unique identifier for the appointment.
    - **client_id**: Unique identifier for the client booking the appointment.
    - **service_type**: Type of service requested.
    - **date**: Date of the appointment (YYYY-MM-DD).
    - **time**: Time of the appointment (HH:MM).
    - **status**: Current status (defaults to 'pending').

    Raises:
        HTTPException (404): If client with `client_id` is not registered.
        HTTPException (400): If appointment with `appointment_id` already exists.
    """
    if appointment.client_id not in clients_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Client with ID '{appointment.client_id}' not found"
        )

    if appointment.appointment_id in appointments_db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Appointment with ID '{appointment.appointment_id}' already booked"
        )

    appointments_db[appointment.appointment_id] = appointment
    return appointment


@router.get(
    "",
    response_model=list[Appointment],
    status_code=status.HTTP_200_OK,
    summary="Get all appointments",
    responses={
        200: {"description": "List of all booked appointments"}
    }
)
@router.get(
    "/",
    response_model=list[Appointment],
    status_code=status.HTTP_200_OK,
    include_in_schema=False
)
def get_all_appointments() -> list[Appointment]:
    """
    Retrieve all booked appointments.

    Returns:
        List of all Appointment objects currently in `appointments_db`.
    """
    return list(appointments_db.values())


@router.get(
    "/{appointment_id}",
    response_model=Appointment,
    status_code=status.HTTP_200_OK,
    summary="Get a specific appointment by ID",
    responses={
        200: {"description": "Appointment record found"},
        404: {"description": "Appointment with the specified ID not found"}
    }
)
def get_appointment_by_id(appointment_id: str) -> Appointment:
    """
    Retrieve details of a specific appointment by its unique appointment ID.

    - **appointment_id**: Unique identifier for the appointment to retrieve.

    Raises:
        HTTPException (404): If no appointment exists with the given `appointment_id`.
    """
    if appointment_id not in appointments_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Appointment with ID '{appointment_id}' not found"
        )
    return appointments_db[appointment_id]
