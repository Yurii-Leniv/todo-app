from typing import Optional, TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from .user import User


class Task(SQLModel, table=True):
    """The actual database table. table=True is what makes this a real table
    rather than just a validation schema."""

    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(min_length=1)
    done: bool = Field(default=False)
    priority: int = Field(default=5, ge=1, le=10)
    user_id: Optional[int] = Field(default=None, foreign_key="users.id")

    user: Optional["User"] = Relationship(back_populates="tasks")


class TaskCreate(SQLModel):
    """What the client sends in the POST /tasks body. No id (the database
    assigns it), no done (a new task always starts undone), and no user_id
    (the server sets it from the logged-in user, not the client)."""

    title: str = Field(min_length=1)
    priority: int = Field(default=5, ge=1, le=10)


class TaskRead(SQLModel):
    """What we return to the client. Kept separate from Task so we control
    exactly which fields are exposed, instead of returning the DB model directly."""

    id: int
    title: str
    done: bool
    priority: int


class TaskUpdate(SQLModel):
    """What the client sends in PATCH /tasks/{id}. All fields are optional
    since a PATCH may only change one field (e.g. just done)."""

    title: Optional[str] = Field(default=None, min_length=1)
    done: Optional[bool] = None
    priority: Optional[int] = Field(default=None, ge=1, le=10)
