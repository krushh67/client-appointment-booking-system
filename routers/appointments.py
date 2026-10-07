"""
Appointment Booking API Router.

This module provides RESTful endpoints for booking and retrieving client appointments
within the Client Appointment Booking System. It integrates directly with the Client
Registration module (Role S2) by validating client existence against `clients_db`
prior to scheduling, and maintains an in-memory appointment data store (`appointments_db`)
for downstream Admin Management (Role S4) consumption.
"""

from typing import Union
from fastapi import APIRouter, HTTPException, status
from models import Appointment, StatusUpdate
from routers.clients import clients_db

__all__ = ["router", "appointments_db"]

router = APIRouter(prefix="/appointments", tags=["Appointments"])

# In-memory store for appointment records: key is appointment_id, value is Appointment model instance
appointments_db: dict[str, Appointment] = {}


@router.post(
    "",
    response_model=Appointment,
    status_code=status.HTTP_200_OK,
    summary="Book a new appointment",
    response_description="The successfully created appointment record",
    responses={
        200: {
            "description": "Appointment successfully booked",
            "model": Appointment
        },
        400: {
            "description": "Duplicate appointment ID provided",
            "content": {
                "application/json": {
                    "example": {"detail": "Appointment with ID 'apt-101' already booked"}
                }
            }
        },
        404: {
            "description": "Referenced client ID does not exist in clients_db",
            "content": {
                "application/json": {
                    "example": {"detail": "Client with ID 'client-001' not found"}
                }
            }
        }
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
    Book a new appointment in the system.

    Validates that:
    1. The client referenced by `client_id` exists in `clients_db` (S2 integration).
    2. The `appointment_id` is unique across all existing appointments.

    Parameters:
        appointment (Appointment): The appointment details payload containing:
            - **appointment_id**: Unique identifier for the appointment.
            - **client_id**: Unique identifier of a registered client.
            - **service_type**: Type of service requested.
            - **date**: Date of appointment in YYYY-MM-DD format.
            - **time**: Time of appointment in HH:MM format.
            - **status**: Current status of appointment (default: 'pending').

    Returns:
        Appointment: The booked appointment record stored in `appointments_db`.

    Raises:
        HTTPException (404): If `client_id` does not exist in `clients_db`.
        HTTPException (400): If `appointment_id` is already present in `appointments_db`.
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
    response_description="A list of all scheduled appointments",
    responses={
        200: {
            "description": "List of all booked appointments",
            "model": list[Appointment]
        }
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
    Retrieve all booked appointments from the in-memory data store.

    Returns:
        list[Appointment]: A list containing all scheduled Appointment instances.
    """
    return list(appointments_db.values())


@router.get(
    "/{appointment_id}",
    response_model=Appointment,
    status_code=status.HTTP_200_OK,
    summary="Get a specific appointment by ID",
    response_description="The requested appointment details",
    responses={
        200: {
            "description": "Appointment record found",
            "model": Appointment
        },
        404: {
            "description": "Appointment with the specified ID not found",
            "content": {
                "application/json": {
                    "example": {"detail": "Appointment with ID 'apt-101' not found"}
                }
            }
        }
    }
)
def get_appointment_by_id(appointment_id: str) -> Appointment:
    """
    Retrieve details of a specific appointment by its unique appointment ID.

    Parameters:
        appointment_id (str): The unique identifier of the appointment to retrieve.

    Returns:
        Appointment: The requested Appointment instance.

    Raises:
        HTTPException (404): If no appointment with `appointment_id` exists.
    """
    if appointment_id not in appointments_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Appointment with ID '{appointment_id}' not found"
        )
    return appointments_db[appointment_id]
