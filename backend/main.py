from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import create_db_and_tables
from routers.auth import router as auth_router
from routers.tasks import router as tasks_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Runs once at startup: creates tasks.db and its tables if they
    # don't exist yet.
    create_db_and_tables()
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(tasks_router)


@app.get("/")
def root():
    return {"status": "ok"}
