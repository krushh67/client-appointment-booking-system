from fastapi import APIRouter, HTTPException, status
from models import Client

router = APIRouter(prefix="/clients", tags=["Client Management"])

# In-memory store for client records: key is client_id, value is Client model instance
clients_db: dict[str, Client] = {}


@router.post(
    "",
    response_model=Client,
    status_code=status.HTTP_200_OK,
    summary="Register a new client",
    responses={
        200: {"description": "Client successfully registered"},
        400: {"description": "Duplicate client ID provided"}
    }
)
@router.post(
    "/",
    response_model=Client,
    status_code=status.HTTP_200_OK,
    include_in_schema=False
)
def register_client(client: Client) -> Client:
    """
    Register a new client in the system.

    - **client_id**: Unique identifier for the client (must be unique).
    - **name**: Full name of the client.
    - **email**: Email address of the client.
    - **phone**: Contact phone number.
    - **registered_at**: ISO timestamp of registration.

    Raises HTTP 400 Bad Request if the client_id already exists in the system.
    """
    if client.client_id in clients_db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Client with ID '{client.client_id}' already registered"
        )
    clients_db[client.client_id] = client
    return client


@router.get(
    "",
    response_model=list[Client],
    status_code=status.HTTP_200_OK,
    summary="Get all clients",
    responses={
        200: {"description": "List of all registered clients"}
    }
)
@router.get(
    "/",
    response_model=list[Client],
    status_code=status.HTTP_200_OK,
    include_in_schema=False
)
def get_all_clients() -> list[Client]:
    """
    Retrieve a list of all registered clients.
    """
    return list(clients_db.values())


@router.get(
    "/{client_id}",
    response_model=Client,
    status_code=status.HTTP_200_OK,
    summary="Get a specific client by ID",
    responses={
        200: {"description": "Client record found"},
        404: {"description": "Client with the specified ID not found"}
    }
)
def get_client_by_id(client_id: str) -> Client:
    """
    Retrieve a specific client's details using their unique client_id.

    Raises HTTP 404 Not Found if no client exists with the given ID.
    """
    if client_id not in clients_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Client with ID '{client_id}' not found"
        )
    return clients_db[client_id]
