from sqlmodel import SQLModel, Session, create_engine

DATABASE_URL = "sqlite:///./tasks.db"

# SQLite за замовчуванням дозволяє використовувати з'єднання лише з того
# потоку, який його створив. FastAPI може обробляти запити в різних потоках,
# тому вимикаємо цю перевірку тут — сесія SQLModel все одно захищає нас від
# реальних проблем конкурентного доступу.
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})


def create_db_and_tables() -> None:
    """Створює tasks.db (якщо немає) і всі таблиці з SQLModel-моделей."""
    SQLModel.metadata.create_all(engine)


def get_session():
    """FastAPI dependency: видає окрему сесію на кожен запит, закриває сама."""
    with Session(engine) as session:
        yield session
