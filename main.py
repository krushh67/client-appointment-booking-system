"""
Main Application Entry Point (Role S4).

FastAPI application for the Client Appointment Booking System.
Registers client, appointment, and admin routers, configures CORS
for frontend integration, and provides the root health-check endpoint.
"""

from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware

from routers.admin import router as admin_router
from routers.appointments import router as appointments_router
from routers.clients import router as clients_router


app = FastAPI(
    title="Client Appointment Booking System",
    description=(
        "A REST API for client registration, appointment booking, "
        "and admin management."
    ),
    version="1.0.0",
)

# Enable CORS for frontend applications, including Vite during development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register project routers.
app.include_router(clients_router)
app.include_router(appointments_router)
app.include_router(admin_router)


@app.get(
    "/",
    status_code=status.HTTP_200_OK,
    summary="Root Health Check",
    tags=["System"],
    responses={
        200: {
            "description": "API is operational",
            "content": {
                "application/json": {
                    "example": {
                        "status": "ok",
                        "message": "Appointment Booking API is running",
                    }
                }
            },
        }
    },
)
def health_check() -> dict[str, str]:
    """Return the operational status of the API."""
    return {
        "status": "ok",
        "message": "Appointment Booking API is running",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
