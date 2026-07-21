def test_list_tasks_without_a_token_is_rejected(client):
    response = client.get("/tasks")

    assert response.status_code == 401


def test_create_task_returns_the_created_task(client, auth_headers):
    response = client.post(
        "/tasks", json={"title": "Buy milk", "priority": 3}, headers=auth_headers
    )

    assert response.status_code == 200
    body = response.json()
    assert body["title"] == "Buy milk"
    assert body["priority"] == 3
    assert body["done"] is False
    assert "id" in body
    assert "user_id" not in body


def test_create_task_with_empty_title_is_rejected(client, auth_headers):
    response = client.post("/tasks", json={"title": ""}, headers=auth_headers)

    assert response.status_code == 422


def test_create_task_with_priority_out_of_range_is_rejected(client, auth_headers):
    response = client.post(
        "/tasks", json={"title": "Test", "priority": 11}, headers=auth_headers
    )

    assert response.status_code == 422


def test_list_tasks_returns_only_the_current_users_tasks(client, auth_headers):
    client.post(
        "/tasks", json={"title": "My task", "priority": 5}, headers=auth_headers
    )

    other_user = client.post(
        "/auth/signup",
        json={"email": "other@example.com", "password": "password123"},
    ).json()
    other_headers = {"Authorization": f"Bearer {other_user['access_token']}"}
    client.post(
        "/tasks", json={"title": "Their task", "priority": 5}, headers=other_headers
    )

    response = client.get("/tasks", headers=auth_headers)

    titles = [task["title"] for task in response.json()]
    assert titles == ["My task"]


def test_search_filters_by_title_case_insensitively(client, auth_headers):
    client.post(
        "/tasks", json={"title": "Buy milk", "priority": 5}, headers=auth_headers
    )
    client.post(
        "/tasks", json={"title": "Clean house", "priority": 5}, headers=auth_headers
    )

    response = client.get("/tasks?search=BUY", headers=auth_headers)

    titles = [task["title"] for task in response.json()]
    assert titles == ["Buy milk"]


def test_status_filter_returns_only_matching_tasks(client, auth_headers):
    done_task = client.post(
        "/tasks", json={"title": "Done task", "priority": 5}, headers=auth_headers
    ).json()
    client.patch(f"/tasks/{done_task['id']}", json={"done": True}, headers=auth_headers)
    client.post(
        "/tasks", json={"title": "Undone task", "priority": 5}, headers=auth_headers
    )

    response = client.get("/tasks?status=done", headers=auth_headers)

    titles = [task["title"] for task in response.json()]
    assert titles == ["Done task"]


def test_sort_by_priority_ascending(client, auth_headers):
    client.post("/tasks", json={"title": "Low", "priority": 1}, headers=auth_headers)
    client.post("/tasks", json={"title": "High", "priority": 9}, headers=auth_headers)

    response = client.get("/tasks?sort=priority&order=asc", headers=auth_headers)

    titles = [task["title"] for task in response.json()]
    assert titles == ["Low", "High"]


def test_sort_by_priority_descending(client, auth_headers):
    client.post("/tasks", json={"title": "Low", "priority": 1}, headers=auth_headers)
    client.post("/tasks", json={"title": "High", "priority": 9}, headers=auth_headers)

    response = client.get("/tasks?sort=priority&order=desc", headers=auth_headers)

    titles = [task["title"] for task in response.json()]
    assert titles == ["High", "Low"]


def test_update_task_changes_only_the_given_fields(client, auth_headers):
    task = client.post(
        "/tasks", json={"title": "Original", "priority": 5}, headers=auth_headers
    ).json()

    response = client.patch(
        f"/tasks/{task['id']}", json={"done": True}, headers=auth_headers
    )

    body = response.json()
    assert body["done"] is True
    assert body["title"] == "Original"
    assert body["priority"] == 5


def test_update_nonexistent_task_returns_404(client, auth_headers):
    response = client.patch("/tasks/9999", json={"done": True}, headers=auth_headers)

    assert response.status_code == 404


def test_cannot_update_another_users_task(client, auth_headers):
    other_user = client.post(
        "/auth/signup",
        json={"email": "other@example.com", "password": "password123"},
    ).json()
    other_headers = {"Authorization": f"Bearer {other_user['access_token']}"}
    their_task = client.post(
        "/tasks", json={"title": "Their task", "priority": 5}, headers=other_headers
    ).json()

    response = client.patch(
        f"/tasks/{their_task['id']}", json={"done": True}, headers=auth_headers
    )

    assert response.status_code == 404


def test_delete_task_removes_it(client, auth_headers):
    task = client.post(
        "/tasks", json={"title": "To delete", "priority": 5}, headers=auth_headers
    ).json()

    delete_response = client.delete(f"/tasks/{task['id']}", headers=auth_headers)
    list_response = client.get("/tasks", headers=auth_headers)

    assert delete_response.status_code == 200
    assert delete_response.json() == {"ok": True}
    assert list_response.json() == []


def test_cannot_delete_another_users_task(client, auth_headers):
    other_user = client.post(
        "/auth/signup",
        json={"email": "other@example.com", "password": "password123"},
    ).json()
    other_headers = {"Authorization": f"Bearer {other_user['access_token']}"}
    their_task = client.post(
        "/tasks", json={"title": "Their task", "priority": 5}, headers=other_headers
    ).json()

    response = client.delete(f"/tasks/{their_task['id']}", headers=auth_headers)

    assert response.status_code == 404


def test_delete_completed_removes_only_done_tasks(client, auth_headers):
    done = client.post(
        "/tasks", json={"title": "Done task", "priority": 5}, headers=auth_headers
    ).json()
    client.post(
        "/tasks", json={"title": "Still todo", "priority": 5}, headers=auth_headers
    )
    client.patch(f"/tasks/{done['id']}", json={"done": True}, headers=auth_headers)

    response = client.delete("/tasks/completed", headers=auth_headers)

    assert response.status_code == 200
    assert response.json() == {"ok": True, "deleted": 1}
    titles = [
        task["title"] for task in client.get("/tasks", headers=auth_headers).json()
    ]
    assert titles == ["Still todo"]


def test_delete_completed_only_affects_current_user(client, auth_headers):
    mine = client.post(
        "/tasks", json={"title": "My done", "priority": 5}, headers=auth_headers
    ).json()
    client.patch(f"/tasks/{mine['id']}", json={"done": True}, headers=auth_headers)

    other_user = client.post(
        "/auth/signup",
        json={"email": "other@example.com", "password": "password123"},
    ).json()
    other_headers = {"Authorization": f"Bearer {other_user['access_token']}"}
    theirs = client.post(
        "/tasks", json={"title": "Their done", "priority": 5}, headers=other_headers
    ).json()
    client.patch(f"/tasks/{theirs['id']}", json={"done": True}, headers=other_headers)

    client.delete("/tasks/completed", headers=auth_headers)

    other_titles = [
        task["title"] for task in client.get("/tasks", headers=other_headers).json()
    ]
    assert other_titles == ["Their done"]


def test_delete_completed_without_a_token_is_rejected(client):
    assert client.delete("/tasks/completed").status_code == 401


def test_create_task_with_due_date_and_category(client, auth_headers):
    response = client.post(
        "/tasks",
        json={
            "title": "Pay rent",
            "priority": 5,
            "due_date": "2030-01-15",
            "category": "Finance",
        },
        headers=auth_headers,
    )

    assert response.status_code == 200
    body = response.json()
    assert body["due_date"] == "2030-01-15"
    assert body["category"] == "Finance"


def test_filter_by_category(client, auth_headers):
    client.post(
        "/tasks",
        json={"title": "Work task", "priority": 5, "category": "Work"},
        headers=auth_headers,
    )
    client.post(
        "/tasks",
        json={"title": "Home task", "priority": 5, "category": "Home"},
        headers=auth_headers,
    )

    response = client.get("/tasks?category=Work", headers=auth_headers)

    titles = [task["title"] for task in response.json()]
    assert titles == ["Work task"]


def test_new_tasks_keep_manual_creation_order_by_default(client, auth_headers):
    for title in ["First", "Second", "Third"]:
        client.post(
            "/tasks", json={"title": title, "priority": 5}, headers=auth_headers
        )

    titles = [
        task["title"] for task in client.get("/tasks", headers=auth_headers).json()
    ]
    assert titles == ["First", "Second", "Third"]


def test_reorder_changes_the_default_order(client, auth_headers):
    ids = [
        client.post(
            "/tasks", json={"title": t, "priority": 5}, headers=auth_headers
        ).json()["id"]
        for t in ["A", "B", "C"]
    ]

    response = client.patch(
        "/tasks/reorder", json={"ids": [ids[2], ids[0], ids[1]]}, headers=auth_headers
    )

    assert response.status_code == 200
    titles = [
        task["title"] for task in client.get("/tasks", headers=auth_headers).json()
    ]
    assert titles == ["C", "A", "B"]


def test_reorder_ignores_tasks_owned_by_other_users(client, auth_headers):
    mine = client.post(
        "/tasks", json={"title": "Mine", "priority": 5}, headers=auth_headers
    ).json()

    other_user = client.post(
        "/auth/signup",
        json={"email": "other@example.com", "password": "password123"},
    ).json()
    other_headers = {"Authorization": f"Bearer {other_user['access_token']}"}
    theirs = client.post(
        "/tasks", json={"title": "Theirs", "priority": 5}, headers=other_headers
    ).json()

    # Passing someone else's id must not touch their task.
    response = client.patch(
        "/tasks/reorder", json={"ids": [theirs["id"], mine["id"]]}, headers=auth_headers
    )

    assert response.status_code == 200
    their_titles = [
        task["title"] for task in client.get("/tasks", headers=other_headers).json()
    ]
    assert their_titles == ["Theirs"]


def test_update_can_set_and_clear_due_date(client, auth_headers):
    task = client.post(
        "/tasks",
        json={"title": "Task", "priority": 5, "due_date": "2030-06-01"},
        headers=auth_headers,
    ).json()

    cleared = client.patch(
        f"/tasks/{task['id']}", json={"due_date": None}, headers=auth_headers
    ).json()

    assert cleared["due_date"] is None
