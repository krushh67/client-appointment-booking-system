"""
Admin Management API Router.

This module provides administrative endpoints for managing appointment statuses,
deleting appointment and client records, and viewing system dashboard metrics.
It directly interacts with `clients_db` and `appointments_db` in-memory stores.
"""

from fastapi import APIRouter, HTTPException, status
from models import Appointment, StatusUpdate
from routers.appointments import appointments_db
from routers.clients import clients_db

__all__ = ["router"]

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.put(
    "/appointments/{appointment_id}/status",
    response_model=Appointment,
    status_code=status.HTTP_200_OK,
    summary="Update an appointment's status",
    responses={
        200: {"description": "Appointment status updated successfully"},
        404: {"description": "Appointment with the specified ID not found"}
    }
)
def update_appointment_status(
    appointment_id: str,
    status_update: StatusUpdate
) -> Appointment:
    """
    Update the status of an existing appointment record (e.g. 'confirmed', 'cancelled').

    - **appointment_id**: Unique identifier of the appointment to update.
    - **status_update**: Payload containing the new status value.

    Raises:
        HTTPException (404): If no appointment exists with the given `appointment_id`.
    """
    if appointment_id not in appointments_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Appointment with ID '{appointment_id}' not found"
        )

    appointments_db[appointment_id].status = status_update.status
    return appointments_db[appointment_id]


@router.delete(
    "/appointments/{appointment_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete an appointment record",
    responses={
        200: {"description": "Appointment record deleted successfully"},
        404: {"description": "Appointment with the specified ID not found"}
    }
)
def delete_appointment(appointment_id: str) -> dict[str, str]:
    """
    Delete an appointment record from the in-memory store.

    - **appointment_id**: Unique identifier of the appointment to delete.

    Raises:
        HTTPException (404): If no appointment exists with the given `appointment_id`.
    """
    if appointment_id not in appointments_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Appointment with ID '{appointment_id}' not found"
        )

    del appointments_db[appointment_id]
    return {"message": f"Appointment with ID '{appointment_id}' deleted successfully"}


@router.delete(
    "/clients/{client_id}",
    status_code=status.HTTP_200_OK,
    summary="Remove a client record",
    responses={
        200: {"description": "Client record removed successfully"},
        404: {"description": "Client with the specified ID not found"}
    }
)
def delete_client(client_id: str) -> dict[str, str]:
    """
    Remove a client record from the in-memory store.

    - **client_id**: Unique identifier of the client to remove.

    Raises:
        HTTPException (404): If no client exists with the given `client_id`.
    """
    if client_id not in clients_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Client with ID '{client_id}' not found"
        )

    del clients_db[client_id]
    return {"message": f"Client with ID '{client_id}' removed successfully"}


@router.get(
    "/dashboard",
    status_code=status.HTTP_200_OK,
    summary="Return administrative dashboard metrics",
    responses={
        200: {"description": "Dashboard metrics summary"}
    }
)
def get_dashboard() -> dict[str, int]:
    """
    Retrieve summary statistics containing total clients, total appointments,
    and pending appointments.

    Returns:
        dict: Object containing total_clients, total_appointments, and pending_appointments count.
    """
    total_clients = len(clients_db)
    total_appointments = len(appointments_db)
    pending_appointments = sum(
        1 for appointment in appointments_db.values()
        if appointment.status.lower() == "pending"
    )

    return {
        "total_clients": total_clients,
        "total_appointments": total_appointments,
        "pending_appointments": pending_appointments
    }
