"""
Main entry point for the Client Appointment Booking System FastAPI application.

This module initializes the FastAPI app instance, registers all domain routers
(Clients, Appointments, Admin), and defines the root health-check endpoint.
"""

from fastapi import FastAPI, status
from routers.admin import router as admin_router
from routers.appointments import router as appointments_router
from routers.clients import router as clients_router

# Initialize the FastAPI application with required title and version
app = FastAPI(
    title="Client Appointment Booking System",
    version="1.0.0",
    description="A Python REST API for client registration, appointment booking, and admin management."
)

# Register project routers
app.include_router(clients_router)
app.include_router(appointments_router)
app.include_router(admin_router)


@app.get(
    "/",
    status_code=status.HTTP_200_OK,
    summary="Health check endpoint",
    responses={
        200: {
            "description": "API is operational",
            "content": {
                "application/json": {
                    "example": {
                        "status": "ok",
                        "message": "Appointment Booking API is running"
                    }
                }
            }
        }
    }
)
def root_health_check() -> dict[str, str]:
    """
    Root endpoint serving as a health check for the Client Appointment Booking System API.

    Returns:
        dict: Standard health check status payload.
    """
    return {
        "status": "ok",
        "message": "Appointment Booking API is running"
    }
