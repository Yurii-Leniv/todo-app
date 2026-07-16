import os
from datetime import datetime, timedelta, timezone

from dotenv import load_dotenv
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlmodel import Session

from database import get_session
from models import User

load_dotenv()

SECRET_KEY = os.environ["JWT_SECRET_KEY"]
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # токен живе добу

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
# tokenUrl лише підказує Swagger UI, куди відправляти логін-форму для кнопки
# "Authorize" — на сам ендпоінт це ніяк не впливає.
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_password_hash(password: str) -> str:
    """Рахує bcrypt-хеш пароля. Оригінальний пароль ми більше ніде не тримаємо."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, password_hash: str) -> bool:
    """Порівнює введений пароль з хешем із бази (сам пароль не розшифровується —
    хеш рахується ще раз і звіряється)."""
    return pwd_context.verify(plain_password, password_hash)


def create_access_token(user: User) -> str:
    """Генерує JWT з user.id в полі 'sub' (subject) і часом закінчення дії."""
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": str(user.id), "exp": expire}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
) -> User:
    """FastAPI dependency: дістає токен із заголовка Authorization: Bearer <token>,
    декодує його і повертає користувача з бази. Якщо токен невалідний,
    протермінований або юзера вже нема в базі — 401."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = session.get(User, int(user_id))
    if user is None:
        raise credentials_exception
    return user
