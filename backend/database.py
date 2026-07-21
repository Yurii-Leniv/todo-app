import os

from dotenv import load_dotenv
from sqlalchemy import inspect, text
from sqlmodel import SQLModel, Session, create_engine

# Load .env before reading DATABASE_URL, since this module is imported before
# any other module calls load_dotenv().
load_dotenv()

DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///./tasks.db")

if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+psycopg://", 1)
elif DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg://", 1)

# check_same_thread is a SQLite-only flag (FastAPI serves requests across
# threads); it must not be passed to a Postgres connection.
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)


_ADDED_TASK_COLUMNS = {
    "due_date": "ALTER TABLE task ADD COLUMN due_date DATE",
    "category": "ALTER TABLE task ADD COLUMN category VARCHAR",
    "position": "ALTER TABLE task ADD COLUMN position INTEGER NOT NULL DEFAULT 0",
}


def _add_missing_task_columns() -> None:
    inspector = inspect(engine)
    if "task" not in inspector.get_table_names():
        return
    existing = {column["name"] for column in inspector.get_columns("task")}
    missing = [sql for name, sql in _ADDED_TASK_COLUMNS.items() if name not in existing]
    if missing:
        with engine.begin() as connection:
            for statement in missing:
                connection.execute(text(statement))


def create_db_and_tables() -> None:
    SQLModel.metadata.create_all(engine)
    _add_missing_task_columns()


def get_session():
    with Session(engine) as session:
        yield session
