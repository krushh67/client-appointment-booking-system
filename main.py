"""
Main entry point for the Client Appointment Booking System FastAPI application.

This module initializes the FastAPI app instance, registers all domain routers
(Clients, Appointments, Admin), sets up CORS middleware for frontend integration,
and defines the root health-check endpoint.
"""

from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from routers.admin import router as admin_router
from routers.appointments import router as appointments_router
from routers.clients import router as clients_router

# Initialize the FastAPI application with required title and version
app = FastAPI(
    title="Client Appointment Booking System",
    version="1.0.0",
    description="A Python REST API for client registration, appointment booking, and admin management."
)

# Enable CORS for frontend applications (supports Vite at http://localhost:5173, etc.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
