from sqlmodel import SQLModel, Session, create_engine

DATABASE_URL = "sqlite:///./tasks.db"

# SQLite only allows a connection to be used by the thread that created it
# by default. FastAPI can handle requests on different threads, so we
# disable that check here — SQLModel's Session still protects us from real
# concurrent-access issues.
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})


def create_db_and_tables() -> None:
    """Creates tasks.db (if missing) and all tables from the SQLModel models."""
    SQLModel.metadata.create_all(engine)


def get_session():
    """FastAPI dependency: yields a separate session per request, closes it itself."""
    with Session(engine) as session:
        yield session
