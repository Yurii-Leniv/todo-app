# Todo App

A simple, multi-user TODO application built as a learning project — a FastAPI backend with JWT authentication paired with a Next.js frontend. Whether you're here to use it, read the code, or contribute, welcome! This README should get you from clone to running app in a few minutes.

## Features

- **Multi-user accounts** — sign up and log in with an email/password; each user only ever sees their own tasks.
- **Task CRUD** — create, view, edit, and delete tasks.
- **Priority levels** — every task has a priority from 1 to 10, shown as a color-coded badge.
- **Search** — filter tasks by title as you type (debounced, so it doesn't spam the API on every keystroke).
- **Status filter** — show all tasks, only done, or only undone.
- **Sorting** — sort tasks by priority, ascending or descending.
- **Polished UI** — loading states, delete confirmation, and small animations when tasks are added or removed.

## Tech Stack

**Backend**
- [FastAPI](https://fastapi.tiangolo.com/) — the web framework
- [SQLModel](https://sqlmodel.tiangolo.com/) (SQLAlchemy + Pydantic) — ORM and data validation
- SQLite — the database (a single file, zero setup)
- [python-jose](https://github.com/mpdavis/python-jose) — JWT creation/verification
- [passlib](https://passlib.readthedocs.io/) + bcrypt — password hashing
- [pytest](https://docs.pytest.org/) + pytest-mock — testing
- [Black](https://black.readthedocs.io/) + [Ruff](https://docs.astral.sh/ruff/) — formatting and linting

**Frontend**
- [Next.js 16](https://nextjs.org/) (App Router) + React 19 + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/) — styling
- [Jest](https://jestjs.io/) + [React Testing Library](https://testing-library.com/react) — component tests
- [Cypress](https://www.cypress.io/) — end-to-end tests
- ESLint + Prettier — linting and formatting

**Infrastructure**
- [Docker](https://www.docker.com/) + Docker Compose — containerized local dev and CI

## Architecture Decisions

A few choices worth explaining, especially if you're new to the codebase:

- **Response schemas are separate from database models.** `Task`/`User` are the actual database tables, but the API never returns them directly — it returns `TaskRead`/`UserRead` instead. This keeps internal fields (like the password hash, or a task's `user_id`) from ever leaking into an API response, on purpose rather than by accident.
- **JWT auth is hand-rolled, not from a third-party auth library.** We evaluated `fastapi-jwt-auth`, but it turned out to be unmaintained and incompatible with Pydantic v2. Since our auth needs are simple (sign a token, verify a token), a small `auth.py` using `python-jose` and `passlib` directly is easier to understand and has no hidden dependency risk.
- **SQLite, not Postgres/MySQL.** For a project this size, a single-file database means anyone can clone the repo and run it with zero external setup — no database server to install or configure.
- **Ownership checks return 404, not 403.** If you try to update or delete another user's task, the API responds as if it doesn't exist at all, rather than confirming it exists but isn't yours. This avoids leaking information about other users' data.
- **Auth state lives in a React Context (`AuthProvider`), not a state management library.** The app's state needs are small enough that Context + a bit of `localStorage` for the JWT is simpler than pulling in Redux/Zustand/etc.

## Getting Started

### Prerequisites

- Python 3.14+ (see `backend/venv` — that's what this project was built and tested against)
- Node.js 20+
- Git
- [Docker](https://www.docker.com/) (optional — only needed if you'd rather skip the local Python/Node setup below; see [Running with Docker](#running-with-docker))

### Backend Setup

```bash
cd backend

# Create and activate a virtual environment (first time only)
python -m venv venv

# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

Create a `backend/.env` file with a JWT signing secret:

```
JWT_SECRET_KEY=<a-long-random-string>
```

You can generate one with:

```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

Then start the server:

```bash
uvicorn main:app --reload
```

The API is now running at **http://localhost:8000** (and `tasks.db` is created automatically on first run).

### Frontend Setup

In a separate terminal:

```bash
cd frontend
npm install
```

Create a `frontend/.env.local` file pointing at the backend:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Then start the dev server:

```bash
npm run dev
```

The app is now running at **http://localhost:3000**. Both the backend and frontend need to be running at the same time.

### Running with Docker

Prefer not to install Python and Node locally? [Docker](https://www.docker.com/) can build and run both services for you.

You still need a `backend/.env` file (see above) — Docker Compose reads your secret from it rather than baking it into the image.

```bash
docker compose up --build
```

This builds the backend and frontend images and starts both:
- Backend at **http://localhost:8000**
- Frontend at **http://localhost:3000**

The backend container mounts your local `backend/` folder as a volume and runs with `--reload`, so backend code changes are picked up live, just like running it without Docker. The frontend image is a full production build (`npm run build`), so frontend changes require re-running `docker compose up --build` to take effect.

To stop everything: `Ctrl+C`, then `docker compose down`.

### Environment Variables Summary

| File | Variable | Description |
|---|---|---|
| `backend/.env` | `JWT_SECRET_KEY` | Secret used to sign JWTs. Keep this private and never commit it. |
| `frontend/.env.local` | `NEXT_PUBLIC_API_URL` | Base URL the frontend uses to reach the backend API. |

## Testing

**Backend** (in `backend/`, with the virtual environment active):

- Unit tests (`tests/test_auth_unit.py`) — password hashing and JWT logic in isolation.
- Integration tests (`tests/test_auth_api.py`, `tests/test_tasks_api.py`) — full API requests against an in-memory test database (the real `tasks.db` is never touched).

```bash
pytest
```

**Frontend** (in `frontend/`):

- Unit tests (`components/__tests__/`) — component rendering and event handling, via Jest + React Testing Library.
- End-to-end tests (`cypress/e2e/`) — full user flows (signup, login, task CRUD, search/filter/sort) driven through a real browser against the real app.

```bash
# Unit tests
npm test

# End-to-end tests (both backend and frontend must already be running)
npm run cypress:open   # interactive
npm run cypress:run    # headless
```

Every push also runs the full suite automatically via [GitHub Actions](.github/workflows/tests.yml) — backend tests, frontend unit tests, and Cypress E2E tests all run in CI.

## Links

- **Live app:** not deployed yet — for now, this is a local-only project (see [Getting Started](#getting-started)).
- **API docs (Swagger UI):** once the backend is running locally, available at [http://localhost:8000/docs](http://localhost:8000/docs).

## Acknowledgments & Authors

Built by [Yurii-Leniv](https://github.com/Yurii-Leniv).

Thanks to the teams behind the open-source tools this project is built on — FastAPI, SQLModel, Next.js, and everything else listed in [Tech Stack](#tech-stack) — for making a project like this approachable to build and learn from.

If you're reading this as a fellow learner: contributions, questions, and issues are welcome.
