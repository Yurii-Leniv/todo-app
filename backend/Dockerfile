FROM python:3.14-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

# --host 0.0.0.0 is required, or the container is unreachable through its port.
CMD exec uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
