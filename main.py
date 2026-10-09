"""
Main Application Entry Point (Role S4).

FastAPI application for the Client Appointment Booking System.
Mounts client, appointment, and admin routers, sets up CORS middleware
for seamless frontend integration, and provides the root health-check endpoint.
"""

from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware

from routers.clients import router as clients_router
from routers.appointments import router as appointments_router
from routers.admin import router as admin_router

app = FastAPI(
    title="Client Appointment Booking System",
    description="Stateless RESTful API for Client Appointment Booking with Admin Management",
    version="1.0.0"
)

# Enable CORS for frontend applications (supports Vite at http://localhost:5173, etc.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(clients_router)
app.include_router(appointments_router)
app.include_router(admin_router)


@app.get(
    "/",
    status_code=status.HTTP_200_OK,
    summary="Root Health Check",
    tags=["System"]
)
def health_check() -> dict[str, str]:
    """
    Health check endpoint to verify that the service is running.
    """
    return {
        "status": "ok",
        "message": "Appointment Booking API is running"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
