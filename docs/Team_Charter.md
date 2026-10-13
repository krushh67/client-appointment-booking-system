# Client Appointment Booking System: Team Charter

> **Owner:** Shweta Lokhande (2303059), Team Lead (Role S1). Original version: commits `a816a07`, `09aa912`, `ae55897` (2026-10-07).
> **Expanded:** 2026-10-12 by Vighnesh Shinde (2303057, Role S10), in coordination with the Team Lead: added the official roster, evidence-based contributions, actual practice and the definition of done.
> **Course:** DevOps Lab · Final-year B.Tech CSE · Team size: 10

---

## 1. Project Purpose & Objectives

The **Client Appointment Booking System** is a RESTful API, written in Python with FastAPI, for client registration, appointment scheduling and administrative management, with a React web interface on top. The aim of the mini-project is to build a small but real application **and** to take it through an end-to-end DevOps workflow.

**Objectives**

1. Deliver working, modular API endpoints for clients, appointments and admin operations.
2. Protect quality with an automated Pytest suite.
3. Collaborate through Git feature branches and GitHub pull requests.
4. Automate build, test and deploy with a Jenkins pipeline.
5. Package the service as Docker images and describe its Kubernetes deployment.
6. Document everything so a reviewer can reproduce it.

## 2. Expected Academic Deliverables

| # | Deliverable | Location | Status (2026-10-12) |
|---|---|---|---|
| 1 | Working API source code | `main.py`, `models.py`, `routers/` | ✅ Present. ⚠️ `routers/admin.py` has stray lines from merge `e688f27`; fix pending |
| 2 | Automated tests | `test_main.py`, `test_appointments.py` | ✅ 19 tests; 19/19 pass once the defect is fixed |
| 3 | Dependency manifest | `requirements.txt` | ✅ Present. ⚠️ Same merge defect |
| 4 | Version-control setup | GitHub repo, `.gitignore`, PRs | ✅ |
| 5 | CI/CD pipeline | `Jenkinsfile` | ✅ Configured; runs not evidenced in the repository |
| 6 | Containerization | `Dockerfile`, `.dockerignore`, `docker-compose.yml`, `frontend/Dockerfile` | ✅ Configured; build not verified in this review |
| 7 | Orchestration | `k8s/deployment.yaml`, `k8s/service.yaml` | ✅ Configured; not applied in this review |
| 8 | Architecture & charter | `docs/Project_Architecture.md`, this file | ✅ |
| 9 | README / user guide | `README.md` | ✅ |
| 10 | Presentation & viva preparation | `docs/PRESENTATION_SCRIPT.md`, `docs/PRESENTATION_QA.md`, `docs/PRESENTATION_CHECKLIST.md` | ✅ |

## 3. Team Composition: Official Roster

| PRN | Name of Student |
|---|---|
| 2303047 | Mayuri J. Masal |
| 2303048 | Vedika Tibugade |
| 2303049 | Suryakant Koli |
| 2303050 | Mansi Patil |
| 2303054 | Apurva Chothe |
| 2303056 | Vaibhav Sutar |
| 2303057 | Vighnesh Shinde |
| 2303058 | Krushnali Patil |
| 2303059 | Shweta Lokhande |
| 2303060 | Prathamesh Patil |

**Team Lead:** Shweta Lokhande. **Documentation owner (README & user guide):** Vighnesh Shinde.

## 4. Team Lead Responsibilities (Shweta Lokhande)

- Define the project scope, architecture and technology stack (`docs/Project_Architecture.md`).
- Write and maintain this Team Charter, including the role matrix and branching policy.
- Split the system into ten independent responsibilities so members can work in parallel.
- Coordinate integration order (models → clients → appointments → admin → tests → CI → containers → K8s → docs).
- Track progress, unblock members and resolve conflicts (see §10).
- Sign off on the definition of done (§11) and present the project.

## 5. Technical Responsibilities (Role Matrix)

### 5.1 Planned responsibilities (Shweta's original matrix, 2026-10-07)

| Role ID | Role | Responsibility | Technologies |
|---|---|---|---|
| **S1** | Product Owner / Team Lead | Project architecture & Team Charter documentation | Markdown, Git, GitHub, Mermaid |
| **S2** | Developer 1 | Client Registration API module (`models.py`, `routers/clients.py`) | Python, FastAPI, Pydantic |
| **S3** | Developer 2 | Appointment Booking API module (`routers/appointments.py`) | Python, FastAPI, Pydantic |
| **S4** | Developer 3 | Admin Management API & entry point (`routers/admin.py`, `main.py`) | Python, FastAPI, Pydantic |
| **S5** | QA Engineer | Pytest test suite & dependencies (`requirements.txt`, `test_main.py`) | Python, Pytest, HTTPX |
| **S6** | Git / GitHub Engineer | Version control setup & branch protection (`.gitignore`) | Git, GitHub |
| **S7** | Jenkins Engineer | Jenkins CI/CD pipeline (`Jenkinsfile`) | Jenkins, Groovy, Pipeline |
| **S8** | Docker Engineer | Docker containerization (`Dockerfile`, `.dockerignore`) | Docker |
| **S9** | Kubernetes Engineer | Kubernetes manifests (`k8s/deployment.yaml`, `k8s/service.yaml`) | Kubernetes, YAML, kubectl |
| **S10** | DevOps / SRE Engineer | Final project documentation & user guide (`README.md`) | Markdown, DevOps |

### 5.2 Member ↔ role: official vs evidenced

Role IDs **do not** follow roster order. The table separates three kinds of statement:

- **Official:** explicitly assigned by the team.
- **Evidenced:** supported by commits and pull requests. Details are in [TEAM_CONTRIBUTION_AUDIT.md](TEAM_CONTRIBUTION_AUDIT.md).
- **To confirm:** the team must confirm before the final submission.

| Role | Member | Basis | Evidence |
|---|---|---|---|
| S1 | Shweta Lokhande (2303059) | **Official** + evidenced | 5 commits creating both docs (root of repo) |
| S2 | Apurva Chothe (2303054) | Evidenced | 5 commits: `models.py`, `routers/clients.py` |
| S3 | Mayuri J. Masal (2303047) | Evidenced | 5 commits: `routers/appointments.py`, `test_appointments.py`. Also built the React frontend (`3d2f728`), which was extra scope |
| S4 | Mansi Patil (2303050) | Evidenced | 2 commits: `routers/admin.py`, `main.py`; PR #1 |
| S5 | Vedika Tibugade (2303048) | Evidenced | `cf79cc3`: `test_main.py`, `requirements.txt`; PR #2 |
| S6 | Krushnali Patil (2303058) and/or Vaibhav Sutar (2303056) | **To confirm** | Krushnali's account `krushh67` owns and administers the GitHub repository and merged PR #2. No commits found for Vaibhav. `.gitignore` itself was written by Mayuri and Suryakant |
| S7 | Suryakant Koli (2303049) | Evidenced | 9 `Jenkinsfile` commits |
| S8 | Suryakant Koli (2303049) | Evidenced; **confirm** whether S8 was officially someone else's | `Dockerfile`, `.dockerignore`, Compose, frontend image |
| S9 | Prathamesh Patil (2303060) | Evidenced | `2f76f62`: both K8s manifests; PR #3 |
| S10 | Vighnesh Shinde (2303057) | **Official** + evidenced | README, audit and presentation documents (this documentation commit) |

> **Accountability note:** the Git history shows commits from 8 of the 10 members. A missing commit does not mean missing effort; planning, testing on a shared machine and repository administration leave little trace in Git. Members whose contribution is "to confirm" should add a short note or commit (for example, a documented branch-protection setup) before submission.

## 6. Collaboration & Communication

- **Channel:** team group chat for daily coordination; GitHub pull requests for code discussion.
- **Integration order:** S1 docs → S2 models/clients → S3 appointments (needs `clients_db`) → S4 admin + `main.py` (needs both stores) → S5 tests → S7/S8/S9 DevOps → S10 docs. Because S3 and S4 depend on earlier modules, their branches were **stacked** on the previous member's branch (visible in PR #1).
- **Shared files:** `main.py`, `requirements.txt` and `test_main.py` are touched by several roles. Announce changes to them in the group before pushing.

## 7. Git Branching, Code Review & Merge Practice

### 7.1 Planned policy: GitFlow (Shweta, 2026-10-07)

1. **`main` (production):** production-ready code, protected against direct pushes, merges must pass Pytest and the Docker build, at least one peer approval.
2. **`develop` (integration):** completed feature branches merge here first.
3. **`feature/<role-id>` branches:** one per role (for example `feature/1` … `feature/10`). All role-specific work happens there, and no member modifies another role's files.

**Workflow:** `git checkout -b feature/<role-id>` → small, meaningful commits → `git push -u origin feature/<role-id>` → open a PR → checks pass in Jenkins → Team Lead approves and merges.

### 7.2 Observed practice (from the repository, 2026-10-12)

| Planned | Observed |
|---|---|
| `main` + `develop` | **`feature/1` is the default and integration branch**; no `develop`; `main` was used for the Jenkins/Docker work and merged into `feature/1` (PR #7) |
| `feature/<role-id>` | Mixed names: `feature/S4`, `feature/S5`, `feature/S9`, `feature/S3-new`, `feature/2`, `feature/7`, `feature/8`, `feature-Client-Registration-API-module/2` |
| ≥ 1 approval; Team Lead merges | 8 PRs, **0 recorded reviews**; most merged by their own author |
| PR must pass CI | No CI status check on PRs. A web-UI merge-conflict resolution (`e688f27`) broke three files and was merged (PR #8) |

### 7.3 Agreed practice going forward

1. Keep `feature/1` as the integration branch, which matches reality and avoids churn. Optionally rename it to `develop` later.
2. Turn on **branch protection** for `feature/1`: require a pull request, 1 approval, and no force-push. This is the S6 owner's task.
3. Run `python -m pytest test_main.py test_appointments.py` locally **before** opening a PR. Ideally, add a GitHub Actions workflow or a Jenkins PR status check.
4. When resolving merge conflicts in the GitHub web editor, check the result for leftover ```` ``` ````, `<<<<<<<` or `>>>>>>>` lines before committing.
5. Commit messages follow Conventional Commits (`feat:`, `fix:`, `docs:`, `test:`, `chore:`), as most of the team already does.
6. Never force-push or rewrite shared history.

## 8. Testing & Quality Expectations

- Every endpoint has at least one success test and one error test.
- Tests must be independent; the `autouse` fixtures clear the in-memory stores.
- `pytest` must pass locally before pushing and in Jenkins before deployment.
- `python -m py_compile` on all modules must succeed (Jenkins "Code Quality Check").
- Known gaps to close: tests for both delete endpoints and the `cancelled` count; add `pytest-cov`.

## 9. Documentation Ownership

| Document | Owner |
|---|---|
| `docs/Project_Architecture.md`, `docs/Team_Charter.md` | Shweta Lokhande (S1); expanded by Vighnesh Shinde |
| `README.md` (user guide) | Vighnesh Shinde (S10) |
| `docs/TEAM_CONTRIBUTION_AUDIT.md`, `docs/PRESENTATION_*.md` | Vighnesh Shinde, for the Team Lead |
| `docs/Docker_Containerization_Guide.md` | Suryakant Koli (S8 work) |
| `frontend/README.md` | Mayuri J. Masal (frontend) |
| Docstrings / OpenAPI descriptions | Each module's developer |

## 10. Conflict Resolution & Task Coordination

1. **Technical conflicts** (for example, two people editing `main.py`): the module owner decides; if unresolved, the Team Lead decides.
2. **Merge conflicts:** resolved by the person merging, then re-tested locally. If unsure, ask the owner of each conflicting file.
3. **Workload or deadline issues:** raise them early in the group. The Team Lead may reassign or pair members.
4. **Interpersonal issues:** discuss privately with the Team Lead; escalate to the faculty guide only if needed.

## 11. Definition of Done

A task is **done** when:

- [ ] The code or config is on a feature branch and merged into `feature/1` through a pull request.
- [ ] `python -m pytest test_main.py test_appointments.py` passes on the merged result.
- [ ] No syntax errors (`py_compile`), and no leftover conflict markers or Markdown fences.
- [ ] New endpoints have tests and appear correctly in Swagger (`/docs`).
- [ ] DevOps artifacts were **executed at least once** (Jenkins build, `docker build`/`run`, `kubectl apply`), with a screenshot or log saved as evidence.
- [ ] The README and architecture docs describe the change.
- [ ] No secrets, virtual environments, `node_modules` or caches are committed.

## 12. Final Contribution & Accountability

- Contributions are reported **honestly**: [TEAM_CONTRIBUTION_AUDIT.md](TEAM_CONTRIBUTION_AUDIT.md) distinguishes official assignments, Git-evidenced work, and items awaiting confirmation.
- Each member should be able to explain their own module or tool during the viva.
- Before submission, the team confirms the S6, S7 and S8 ownership and Vaibhav Sutar's contribution, and updates §5.2.
- The shared credit principle: the project succeeds or fails as a team, and integration problems are fixed together, without blame.

---

## Related Documentation

- 📐 [Project Architecture Documentation](./Project_Architecture.md)
- 🔎 [Team Contribution Audit](./TEAM_CONTRIBUTION_AUDIT.md)
- 📘 [README / User Guide](../README.md)
