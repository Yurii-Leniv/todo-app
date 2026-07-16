from typing import List, Optional, TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from .user import User


class Task(SQLModel, table=True):
    """Реальна таблиця в базі. table=True — саме це робить її таблицею,
    а не просто схемою валідації."""

    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(min_length=1)
    done: bool = Field(default=False)
    priority: int = Field(default=5, ge=1, le=10)
    user_id: Optional[int] = Field(default=None, foreign_key="users.id")

    user: Optional["User"] = Relationship(back_populates="tasks")


class TaskCreate(SQLModel):
    """Що клієнт надсилає в тілі POST /tasks. Без id (база призначає сама),
    без done (нова задача завжди починається невиконаною) і без user_id
    (його підставляє сервер із поточного залогіненого користувача, а не клієнт)."""

    title: str = Field(min_length=1)
    priority: int = Field(default=5, ge=1, le=10)


class TaskRead(SQLModel):
    """Що ми повертаємо клієнту. Окремо від Task, щоб контролювати,
    які саме поля віддаються, а не віддавати DB-модель напряму."""

    id: int
    title: str
    done: bool
    priority: int


class TaskUpdate(SQLModel):
    """Що клієнт надсилає в PATCH /tasks/{id}. Усі поля опціональні,
    бо PATCH може змінювати лише одне поле (наприклад, тільки done)."""

    title: Optional[str] = Field(default=None, min_length=1)
    done: Optional[bool] = None
    priority: Optional[int] = Field(default=None, ge=1, le=10)
