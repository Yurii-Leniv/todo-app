from datetime import datetime
from typing import List, Optional, TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from .task import Task


class User(SQLModel, table=True):
    """Реальна таблиця users. Пароль ніколи не зберігаємо як є —
    тільки password_hash, який рахує auth.py."""

    __tablename__ = "users"

    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    password_hash: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    tasks: List["Task"] = Relationship(back_populates="user")


class UserCreate(SQLModel):
    """Що клієнт надсилає на /auth/signup і /auth/login."""

    email: str
    password: str = Field(min_length=8)


class UserRead(SQLModel):
    """Що повертаємо в GET /auth/me. Без password_hash — це принципово."""

    id: int
    email: str
    created_at: datetime
