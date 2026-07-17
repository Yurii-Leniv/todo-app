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
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # token is valid for one day

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
# tokenUrl only tells Swagger UI where to send the login form for its
# "Authorize" button — it has no effect on the endpoint itself.
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_password_hash(password: str) -> str:
    """Computes a bcrypt hash of the password. We never store the raw password."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, password_hash: str) -> bool:
    """Compares an input password against the stored hash (the hash is never
    decrypted — it's recomputed from the input and compared)."""
    return pwd_context.verify(plain_password, password_hash)


def create_access_token(user: User) -> str:
    """Generates a JWT with user.id in the 'sub' (subject) claim and an expiry time."""
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": str(user.id), "exp": expire}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
) -> User:
    """FastAPI dependency: reads the token from the Authorization: Bearer <token>
    header, decodes it, and returns the matching user from the database. Returns
    401 if the token is invalid, expired, or the user no longer exists."""
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
