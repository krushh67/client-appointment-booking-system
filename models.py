from pydantic import BaseModel, Field


class Client(BaseModel):
    """
    Client model representing a registered client in the appointment booking system.
    """
    client_id: str = Field(
        ...,
        description="Unique identifier for the client",
        examples=["client-001"]
    )
    name: str = Field(
        ...,
        description="Full name of the client",
        examples=["Alice Smith"]
    )
    email: str = Field(
        ...,
        description="Email address of the client",
        examples=["alice@example.com"]
    )
    phone: str = Field(
        ...,
        description="Contact phone number of the client",
        examples=["+1-555-0199"]
    )
    registered_at: str = Field(
        ...,
        description="Timestamp of client registration in ISO format",
        examples=["2026-10-07T10:00:00Z"]
    )


class Appointment(BaseModel):
    """
    Appointment model representing a scheduled appointment.
    """
    appointment_id: str = Field(
        ...,
        description="Unique identifier for the appointment",
        examples=["apt-101"]
    )
    client_id: str = Field(
        ...,
        description="ID of the client booking the appointment",
        examples=["client-001"]
    )
    service_type: str = Field(
        ...,
        description="Type of service requested",
        examples=["General Consultation"]
    )
    date: str = Field(
        ...,
        description="Scheduled appointment date (YYYY-MM-DD)",
        examples=["2026-10-15"]
    )
    time: str = Field(
        ...,
        description="Scheduled appointment time (HH:MM)",
        examples=["14:30"]
    )
    status: str = Field(
        default="pending",
        description="Current appointment status (pending | confirmed | cancelled)",
        examples=["pending"]
    )


class StatusUpdate(BaseModel):
    """
    Status update payload model for appointment status transitions.
    """
    status: str = Field(
        ...,
        description="Updated status string (e.g., confirmed, cancelled)",
        examples=["confirmed"]
    )
