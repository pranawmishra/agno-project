# Use the official Python image as the base 
FROM python:3.13-slim

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /usr/local/bin/

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container
COPY pyproject.toml uv.lock ./

# Install the dependencies (np project , just dependencies)
RUN uv sync --frozen --no-install-project --no-dev

# Copy the rest of the application code into the container
COPY app/ ./app/

# Create the SQLite data directory (matches db_file default in config.py)
RUN mkdir -p data/tmp

# Expose the port the app runs on
EXPOSE 8000

# Set the entrypoint to the FastAPI app
CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]