# ==============================================================================
# Dockerfile - Client Appointment Booking System (Role S8: Docker Engineer)
# Multi-stage, secure, production-grade container image for FastAPI backend.
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Dependency Builder
# Compiles and installs Python dependencies in isolation to minimize final image size.
# ------------------------------------------------------------------------------
FROM python:3.9-slim AS builder

WORKDIR /build

# Configure pip to avoid cache bloat
ENV PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PYTHONDONTWRITEBYTECODE=1

# Install runtime dependencies
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# ------------------------------------------------------------------------------
# Stage 2: Minimal Production Runtime
# Lightweight image running as an unprivileged user for security compliance.
# ------------------------------------------------------------------------------
FROM python:3.9-slim AS runner

# Metadata labels
LABEL maintainer="Team Member 8 <docker-engineer@example.com>" \
      org.opencontainers.image.title="Client Appointment Booking System API" \
      org.opencontainers.image.description="FastAPI RESTful service for client registration and appointment booking" \
      org.opencontainers.image.version="1.0.0" \
      org.opencontainers.image.vendor="DevOps Engineering Team"

# Environment variables:
# - PYTHONDONTWRITEBYTECODE: prevents generation of .pyc cache files
# - PYTHONUNBUFFERED: forces unbuffered stdout/stderr for real-time container log streaming
# - PATH: includes user-installed Python binaries in $PATH
# - PYTHONPATH: ensures modules in /app are resolvable
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/home/appuser/.local/bin:${PATH}" \
    PYTHONPATH="/app"

# Security: Create non-root group and user
RUN groupadd --gid 1001 appgroup && \
    useradd --uid 1001 --gid 1001 --create-home --shell /bin/bash appuser

WORKDIR /app

# Copy installed Python packages from builder stage to appuser's home
COPY --from=builder /root/.local /home/appuser/.local

# Copy application source code with proper non-root ownership
COPY --chown=appuser:appgroup main.py models.py ./
COPY --chown=appuser:appgroup routers/ ./routers/

# Fix permissions
RUN chown -R appuser:appgroup /app /home/appuser

# Switch to non-root user
USER appuser

# Expose API application port
EXPOSE 8000

# Container health check using Python standard library (no curl dependency required)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/').read()" || exit 1

# Start Uvicorn ASGI server in exec form for graceful SIGTERM shutdown
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
