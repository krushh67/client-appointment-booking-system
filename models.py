from pydantic import BaseModel


class Client(BaseModel):
    client_id: str
    name: str
    email: str
    phone: str
    registered_at: str


class Appointment(BaseModel):
    appointment_id: str
    client_id: str
    service_type: str
    date: str
    time: str
    status: str = "pending"  # pending | confirmed | cancelled


class StatusUpdate(BaseModel):
    status: str
