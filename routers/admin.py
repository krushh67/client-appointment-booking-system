"""
Admin Management API Router (Role S4).

This module provides administrative operations for managing appointments and clients,
including updating appointment statuses, deleting appointments, deleting clients,
and retrieving system-wide dashboard statistics.
"""

from fastapi import APIRouter, HTTPException, status
from models import StatusUpdate, Appointment, Client
from routers.clients import clients_db
from routers.appointments import appointments_db

__all__ = ["router"]

router = APIRouter(prefix="/admin", tags=["Admin Management"])


@router.put(
    "/appointments/{appointment_id}/status",
    response_model=Appointment,
    status_code=status.HTTP_200_OK,
    summary="Update appointment status",
    responses={
        200: {"description": "Appointment status updated successfully"},
        404: {"description": "Appointment with specified ID not found"}
    }
)
def update_appointment_status(appointment_id: str, update: StatusUpdate) -> Appointment:
    """
    Update the status of an existing appointment.

    - **appointment_id**: The unique identifier of the appointment.
    - **status**: The new status (e.g., 'confirmed', 'cancelled', 'pending').
    """
    if appointment_id not in appointments_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Appointment with ID '{appointment_id}' not found"
        )
    
    appointment = appointments_db[appointment_id]
    appointment.status = update.status
    appointments_db[appointment_id] = appointment
    return appointment


@router.delete(
    "/appointments/{appointment_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete an appointment record",
    responses={
        200: {"description": "Appointment successfully deleted"},
        404: {"description": "Appointment with specified ID not found"}
    }
)
def delete_appointment(appointment_id: str) -> dict[str, str]:
    """
    Delete an appointment record from the in-memory store.
    """
    if appointment_id not in appointments_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Appointment with ID '{appointment_id}' not found"
        )
    del appointments_db[appointment_id]
    return {"message": f"Appointment with ID '{appointment_id}' successfully deleted"}


@router.delete(
    "/clients/{client_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete a client record",
    responses={
        200: {"description": "Client successfully deleted"},
        404: {"description": "Client with specified ID not found"}
    }
)
def delete_client(client_id: str) -> dict[str, str]:
    """
    Delete a client record and clean up associated appointments.
    """
    if client_id not in clients_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Client with ID '{client_id}' not found"
        )
    del clients_db[client_id]
    
    # Also clean up any associated appointments for consistency
    associated_apts = [
        apt_id for apt_id, apt in appointments_db.items()
        if apt.client_id == client_id
    ]
    for apt_id in associated_apts:
        del appointments_db[apt_id]

    return {"message": f"Client with ID '{client_id}' and associated appointments successfully deleted"}


@router.get(
    "/dashboard",
    status_code=status.HTTP_200_OK,
    summary="Retrieve administrative dashboard statistics",
    responses={
        200: {"description": "Dashboard statistics summary"}
    }
)
def get_dashboard_stats() -> dict[str, int]:
    """
    Return summary statistics:
    - total_clients: Total registered clients
    - total_appointments: Total scheduled appointments
    - pending_appointments: Total appointments currently in pending status
    """
    total_clients = len(clients_db)
    total_appointments = len(appointments_db)
    pending_appointments = sum(
        1 for apt in appointments_db.values() if apt.status == "pending"
    )
    confirmed_appointments = sum(
        1 for apt in appointments_db.values() if apt.status == "confirmed"
    )
    cancelled_appointments = sum(
        1 for apt in appointments_db.values() if apt.status == "cancelled"
    )

    return {
        "total_clients": total_clients,
        "total_appointments": total_appointments,
        "pending_appointments": pending_appointments,
        "confirmed_appointments": confirmed_appointments,
        "cancelled_appointments": cancelled_appointments
    }
