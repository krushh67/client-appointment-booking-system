from fastapi import APIRouter, HTTPException, status
from models import Client

router = APIRouter(prefix="/clients", tags=["Client Management"])

# In-memory store for client records
clients_db: dict[str, Client] = {}


@router.post("", response_model=Client, status_code=status.HTTP_200_OK)
@router.post("/", response_model=Client, status_code=status.HTTP_200_OK, include_in_schema=False)
def register_client(client: Client):
    """
    Register a new client. Checks for duplicate client_id.
    """
    if client.client_id in clients_db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Client with ID '{client.client_id}' already registered"
        )
    clients_db[client.client_id] = client
    return client
