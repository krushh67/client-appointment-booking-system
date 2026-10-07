# Client Appointment Booking System — DevOps Mini Project

## Project Overview & Purpose
The **Client Appointment Booking System** is a modern, stateless RESTful API designed to manage client registrations, appointment scheduling, and administrative operations. The primary goal of this mini-project is to build a robust, scalable Python FastAPI application supported by an end-to-end DevOps automation pipeline spanning containerization, automated testing, continuous integration/continuous deployment (CI/CD), and Kubernetes orchestration.

---

## Team Charter & Role Matrix

| Role ID | Name | Role | Responsibility | Technologies |
|---|---|---|---|---|
| **S1** | Shweta | Product Owner / Team Lead | Project Architecture & Team Charter documentation | Markdown, Git, GitHub, Mermaid |
| **S2** | Team Member 2 | Developer 1 | Client Registration API module (`models.py`, `routers/clients.py`) | Python, FastAPI, Pydantic |
| **S3** | Team Member 3 | Developer 2 | Appointment Booking API module (`routers/appointments.py`) | Python, FastAPI, Pydantic |
| **S4** | Team Member 4 | Developer 3 | Admin Management API & entry point (`routers/admin.py`, `main.py`) | Python, FastAPI, Pydantic |
| **S5** | Team Member 5 | QA Engineer | Pytest test suite & dependencies (`requirements.txt`, `test_main.py`) | Python, Pytest, HTTPX |
| **S6** | Team Member 6 | Git Engineer | Version control setup & branch protection (`.gitignore`) | Git, GitHub |
| **S7** | Team Member 7 | Jenkins Engineer | Jenkins CI/CD pipeline (`Jenkinsfile`) | Jenkins, Groovy, Pipeline |
| **S8** | Team Member 8 | Docker Engineer | Docker containerization (`Dockerfile`, `.dockerignore`) | Docker, Containerization |
| **S9** | Team Member 9 | Kubernetes Engineer | Kubernetes manifests (`k8s/deployment.yaml`, `k8s/service.yaml`) | Kubernetes, YAML, Kubectl |
| **S10** | Team Member 10 | DevOps / SRE Engineer | Final project documentation & user guide (`README.md`) | Markdown, DevOps |
