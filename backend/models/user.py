from datetime import datetime, timezone
from typing import List, Optional, TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from .task import Task


def _utcnow() -> datetime:
    # datetime.utcnow() is deprecated (returns a naive datetime with no
    # timezone info). now(timezone.utc) is the timezone-aware replacement.
    return datetime.now(timezone.utc)


class User(SQLModel, table=True):
    __tablename__ = "users"

    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    password_hash: str
    created_at: datetime = Field(default_factory=_utcnow)

    tasks: List["Task"] = Relationship(back_populates="user")


class UserCreate(SQLModel):
    email: str
    password: str = Field(min_length=8)


class UserRead(SQLModel):
    id: int
    email: str
    created_at: datetime
