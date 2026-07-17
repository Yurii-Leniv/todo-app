import pytest
from fastapi.testclient import TestClient
from sqlalchemy.pool import StaticPool
from sqlmodel import Session, SQLModel, create_engine

from database import get_session
from main import app


@pytest.fixture(name="session")
def session_fixture():
    """A fresh in-memory SQLite database for each test. This never touches
    the real tasks.db file, and every test starts from a clean, empty
    database instead of sharing state with other tests."""
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session


@pytest.fixture(name="client")
def client_fixture(session: Session):
    """A TestClient wired to the in-memory test database instead of the real
    one, via FastAPI's dependency_overrides mechanism."""

    def get_session_override():
        return session

    app.dependency_overrides[get_session] = get_session_override
    yield TestClient(app)
    app.dependency_overrides.clear()


@pytest.fixture
def auth_headers(client: TestClient) -> dict[str, str]:
    """Signs up a fresh test user through the real API and returns an
    Authorization header for them, so task-related tests don't each have to
    repeat the signup boilerplate."""
    response = client.post(
        "/auth/signup",
        json={"email": "testuser@example.com", "password": "password123"},
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}
