FROM python:3.14-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

# --host 0.0.0.0 is required: uvicorn's default (127.0.0.1) would be
# unreachable through the published port. Shell form so $PORT expands
# (Render/Railway assign it at runtime; defaults to 8000 locally) — `exec`
# replaces the shell with uvicorn so it becomes PID 1 and receives
# SIGTERM directly, instead of the shell swallowing it.
CMD exec uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
