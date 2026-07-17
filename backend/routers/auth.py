from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, SQLModel, select

from auth import (
    create_access_token,
    get_current_user,
    get_password_hash,
    verify_password,
)
from database import get_session
from models import User, UserCreate, UserRead

router = APIRouter(prefix="/auth", tags=["auth"])


class Token(SQLModel):
    """What /auth/signup and /auth/login return to the client."""

    access_token: str
    token_type: str = "bearer"


@router.post("/signup", response_model=Token)
def signup(user_in: UserCreate, session: Session = Depends(get_session)):
    existing = session.exec(select(User).where(User.email == user_in.email)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(email=user_in.email, password_hash=get_password_hash(user_in.password))
    session.add(user)
    session.commit()
    session.refresh(user)

    return Token(access_token=create_access_token(user))


@router.post("/login", response_model=Token)
def login(user_in: UserCreate, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == user_in.email)).first()
    if not user or not verify_password(user_in.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password"
        )

    return Token(access_token=create_access_token(user))


@router.get("/me", response_model=UserRead)
def me(user: User = Depends(get_current_user)):
    return user
