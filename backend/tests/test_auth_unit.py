from datetime import timedelta

from jose import jwt

from auth import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    ALGORITHM,
    SECRET_KEY,
    create_access_token,
    get_password_hash,
    verify_password,
)
from models import User


def test_password_hash_is_not_the_plain_password():
    password = "supersecret123"

    assert get_password_hash(password) != password


def test_verify_password_accepts_the_correct_password():
    password = "supersecret123"
    hashed = get_password_hash(password)

    assert verify_password(password, hashed) is True


def test_verify_password_rejects_a_wrong_password():
    hashed = get_password_hash("supersecret123")

    assert verify_password("wrong-password", hashed) is False


def test_hashing_the_same_password_twice_gives_different_hashes():
    password = "supersecret123"

    assert get_password_hash(password) != get_password_hash(password)


def test_create_access_token_contains_the_user_id():
    user = User(id=42, email="alice@example.com", password_hash="irrelevant")

    token = create_access_token(user)
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

    assert payload["sub"] == "42"


def test_create_access_token_expires_after_the_configured_duration(mocker):
    from datetime import datetime, timezone

    frozen_now = datetime(2030, 1, 1, tzinfo=timezone.utc)
    mocker.patch("auth.datetime").now.return_value = frozen_now

    user = User(id=1, email="bob@example.com", password_hash="irrelevant")
    token = create_access_token(user)
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

    expected_expiry = frozen_now + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    assert payload["exp"] == expected_expiry.timestamp()
