def test_signup_returns_a_bearer_token(client):
    response = client.post(
        "/auth/signup",
        json={"email": "alice@example.com", "password": "password123"},
    )

    assert response.status_code == 200
    body = response.json()
    assert "access_token" in body
    assert body["token_type"] == "bearer"


def test_signup_with_duplicate_email_is_rejected(client):
    client.post(
        "/auth/signup",
        json={"email": "alice@example.com", "password": "password123"},
    )

    response = client.post(
        "/auth/signup",
        json={"email": "alice@example.com", "password": "another-password"},
    )

    assert response.status_code == 400


def test_signup_with_short_password_is_rejected(client):
    response = client.post(
        "/auth/signup", json={"email": "alice@example.com", "password": "short"}
    )

    assert response.status_code == 422


def test_login_with_correct_credentials_returns_a_token(client):
    client.post(
        "/auth/signup",
        json={"email": "alice@example.com", "password": "password123"},
    )

    response = client.post(
        "/auth/login",
        json={"email": "alice@example.com", "password": "password123"},
    )

    assert response.status_code == 200
    assert "access_token" in response.json()


def test_login_with_wrong_password_is_rejected(client):
    client.post(
        "/auth/signup",
        json={"email": "alice@example.com", "password": "password123"},
    )

    response = client.post(
        "/auth/login",
        json={"email": "alice@example.com", "password": "wrong-password"},
    )

    assert response.status_code == 401


def test_login_with_unknown_email_is_rejected(client):
    response = client.post(
        "/auth/login",
        json={"email": "nobody@example.com", "password": "password123"},
    )

    assert response.status_code == 401


def test_me_returns_the_current_user_without_password_hash(client, auth_headers):
    response = client.get("/auth/me", headers=auth_headers)

    assert response.status_code == 200
    body = response.json()
    assert body["email"] == "testuser@example.com"
    assert "password_hash" not in body


def test_me_without_a_token_is_rejected(client):
    response = client.get("/auth/me")

    assert response.status_code == 401


def test_me_with_a_garbage_token_is_rejected(client):
    response = client.get(
        "/auth/me", headers={"Authorization": "Bearer garbage.token.here"}
    )

    assert response.status_code == 401


def test_login_is_case_insensitive_for_email(client):
    client.post(
        "/auth/signup",
        json={"email": "Alice@Example.com", "password": "password123"},
    )

    response = client.post(
        "/auth/login",
        json={"email": "alice@example.COM", "password": "password123"},
    )

    assert response.status_code == 200
    assert "access_token" in response.json()


def test_signup_duplicate_email_is_rejected_regardless_of_case(client):
    client.post(
        "/auth/signup",
        json={"email": "alice@example.com", "password": "password123"},
    )

    response = client.post(
        "/auth/signup",
        json={"email": "ALICE@EXAMPLE.COM", "password": "password123"},
    )

    assert response.status_code == 400
