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
