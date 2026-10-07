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

---

## GitFlow Branching Strategy

Our team enforces a structured GitFlow branching strategy to ensure code quality, isolate feature development, and support automated CI/CD validation.

### Branch Structure

1. **`main` Branch (Production)**
   - Contains production-ready code.
   - Protected against direct pushes.
   - Merges into `main` must pass all automated status checks (Pytest suite, Docker build verification).
   - Requires at least one peer code review approval before merging.

2. **`develop` Branch (Integration)**
   - Acts as the primary integration branch for active development.
   - All completed feature branches are merged here first for integration testing.

3. **`feature/<role-id>` Branches (Task Isolation)**
   - Created for individual role assignments (e.g., `feature/1`, `feature/2`, ..., `feature/10`).
   - All role-specific development, debugging, and testing occur exclusively within the respective feature branch.
   - No team member modifies files assigned to another team member's role.

### Workflow & Commit Guidelines

- **Branch Creation**: Each member creates a branch using `git checkout -b feature/<role-id>` from `main`.
- **Atomic & Meaningful Commits**: Team members make clear, logical commits for each stage of development (e.g., structure, core logic, tests, docs).
- **Pull Request Protocol**:
  1. Push feature branch to GitHub (`git push -u origin feature/<role-id>`).
  2. Open a Pull Request targeting `main` (or `develop`).
  3. Ensure automated checks pass in Jenkins/GitHub Actions.
  4. Team Lead approves and merges the Pull Request.

