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


@router.get("", response_model=list[Client], status_code=status.HTTP_200_OK)
@router.get("/", response_model=list[Client], status_code=status.HTTP_200_OK, include_in_schema=False)
def get_all_clients():
    """
    Retrieve all registered clients.
    """
    return list(clients_db.values())


@router.get("/{client_id}", response_model=Client, status_code=status.HTTP_200_OK)
def get_client_by_id(client_id: str):
    """
    Retrieve a specific client by client_id. Returns 404 if not found.
    """
    if client_id not in clients_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Client with ID '{client_id}' not found"
        )
    return clients_db[client_id]
