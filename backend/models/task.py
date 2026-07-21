from datetime import date
from typing import Optional, TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from .user import User


class Task(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(min_length=1)
    done: bool = Field(default=False)
    priority: int = Field(default=5, ge=1, le=10)
    due_date: Optional[date] = Field(default=None)
    category: Optional[str] = Field(default=None)
    position: int = Field(default=0, index=True)
    user_id: Optional[int] = Field(default=None, foreign_key="users.id")

    user: Optional["User"] = Relationship(back_populates="tasks")


class TaskCreate(SQLModel):
    title: str = Field(min_length=1)
    priority: int = Field(default=5, ge=1, le=10)
    due_date: Optional[date] = None
    category: Optional[str] = Field(default=None, max_length=50)


class TaskRead(SQLModel):
    id: int
    title: str
    done: bool
    priority: int
    due_date: Optional[date]
    category: Optional[str]
    position: int


class TaskUpdate(SQLModel):
    title: Optional[str] = Field(default=None, min_length=1)
    done: Optional[bool] = None
    priority: Optional[int] = Field(default=None, ge=1, le=10)
    due_date: Optional[date] = None
    category: Optional[str] = Field(default=None, max_length=50)
