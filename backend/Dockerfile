FROM python:3.14-slim

WORKDIR /app

# Copied and installed separately from the rest of the source so Docker can
# cache this layer — it only gets invalidated when requirements.txt itself
# changes, not on every code edit.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

# --host 0.0.0.0 is required, not optional: uvicorn's default (127.0.0.1)
# only accepts connections from inside the container itself, which would
# make the app unreachable through the published port. --reload pairs with
# the bind-mounted source volume in docker-compose.yml for a live-reloading
# local dev setup.
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
