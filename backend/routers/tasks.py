from typing import Literal, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from auth import get_current_user
from database import get_session
from models import Task, TaskCreate, TaskRead, TaskUpdate, User

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.post("", response_model=TaskRead)
def create_task(
    task: TaskCreate,
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user),
):
    db_task = Task.model_validate(task, update={"user_id": user.id})
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task


@router.get("", response_model=list[TaskRead])
def list_tasks(
    search: Optional[str] = None,
    status: Optional[Literal["done", "undone"]] = None,
    sort: Optional[Literal["priority"]] = None,
    order: Literal["asc", "desc"] = "asc",
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user),
):
    query = select(Task).where(Task.user_id == user.id)

    if search:
        query = query.where(Task.title.ilike(f"%{search}%"))

    if status == "done":
        query = query.where(Task.done.is_(True))
    elif status == "undone":
        query = query.where(Task.done.is_(False))

    if sort == "priority":
        query = query.order_by(Task.priority.desc() if order == "desc" else Task.priority.asc())

    return session.exec(query).all()


@router.patch("/{task_id}", response_model=TaskRead)
def update_task(
    task_id: int,
    task_update: TaskUpdate,
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user),
):
    db_task = session.get(Task, task_id)
    if not db_task or db_task.user_id != user.id:
        raise HTTPException(status_code=404, detail="Task not found")

    # exclude_unset=True — беремо лише ті поля, які клієнт реально надіслав,
    # щоб випадково не затерти інші поля значенням None.
    update_data = task_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_task, key, value)

    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task


@router.delete("/{task_id}")
def delete_task(
    task_id: int,
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user),
):
    db_task = session.get(Task, task_id)
    if not db_task or db_task.user_id != user.id:
        raise HTTPException(status_code=404, detail="Task not found")

    session.delete(db_task)
    session.commit()
    return {"ok": True}
