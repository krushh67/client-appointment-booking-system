```python
"""
Admin Management API Router (Role S4).

Provides administrative operations for managing appointment statuses,
deleting appointments and clients, cleaning up associated appointments,
and retrieving dashboard statistics.
"""

from fastapi import APIRouter, HTTPException, status

from models import Appointment, StatusUpdate
from routers.appointments import appointments_db
from routers.clients import clients_db

__all__ = ["router"]

router = APIRouter(prefix="/admin", tags=["Admin Management"])


@router.put(
    "/appointments/{appointment_id}/status",
    response_model=Appointment,
    status_code=status.HTTP_200_OK,
    summary="Update appointment status",
    responses={
        200: {"description": "Appointment status updated successfully"},
        404: {"description": "Appointment with the specified ID not found"},
    },
)
def update_appointment_status(
    appointment_id: str,
    status_update: StatusUpdate,
) -> Appointment:
    """Update the status of an existing appointment."""
    if appointment_id not in appointments_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Appointment with ID '{appointment_id}' not found",
        )

    appointment = appointments_db[appointment_id]
    appointment.status = status_update.status
    appointments_db[appointment_id] = appointment

    return appointment


@router.delete(
    "/appointments/{appointment_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete an appointment record",
    responses={
        200: {"description": "Appointment deleted successfully"},
        404: {"description": "Appointment with the specified ID not found"},
    },
)
def delete_appointment(appointment_id: str) -> dict[str, str]:
    """Delete an appointment from the in-memory store."""
    if appointment_id not in appointments_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Appointment with ID '{appointment_id}' not found",
        )

    del appointments_db[appointment_id]

    return {
        "message": f"Appointment with ID '{appointment_id}' deleted successfully"
    }


@router.delete(
    "/clients/{client_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete a client record",
    responses={
        200: {"description": "Client and associated appointments deleted"},
        404: {"description": "Client with the specified ID not found"},
    },
)
def delete_client(client_id: str) -> dict[str, str]:
    """Delete a client and all appointments associated with that client."""
    if client_id not in clients_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Client with ID '{client_id}' not found",
        )

    del clients_db[client_id]

    # Remove associated appointments to maintain data consistency.
    associated_appointment_ids = [
        appointment_id
        for appointment_id, appointment in appointments_db.items()
        if appointment.client_id == client_id
    ]

    for appointment_id in associated_appointment_ids:
        del appointments_db[appointment_id]

    return {
        "message": (
            f"Client with ID '{client_id}' and associated appointments "
            "deleted successfully"
        )
    }


@router.get(
    "/dashboard",
    status_code=status.HTTP_200_OK,
    summary="Retrieve administrative dashboard statistics",
    responses={
        200: {"description": "Dashboard statistics summary"},
    },
)
def get_dashboard_stats() -> dict[str, int]:
    """Return client totals and appointment counts by status."""
    total_clients = len(clients_db)
    total_appointments = len(appointments_db)

    pending_appointments = sum(
        1
        for appointment in appointments_db.values()
        if appointment.status.lower() == "pending"
    )

    confirmed_appointments = sum(
        1
        for appointment in appointments_db.values()
        if appointment.status.lower() == "confirmed"
    )

    cancelled_appointments = sum(
        1
        for appointment in appointments_db.values()
        if appointment.status.lower() == "cancelled"
    )

    return {
        "total_clients": total_clients,
        "total_appointments": total_appointments,
        "pending_appointments": pending_appointments,
        "confirmed_appointments": confirmed_appointments,
        "cancelled_appointments": cancelled_appointments,
    }
```