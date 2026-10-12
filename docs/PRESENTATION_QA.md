# Presentation Q&A: Likely Faculty Questions

> For the Team Lead (Shweta Lokhande) and every member. Answers match the actual repository (`feature/1`, commit `b5030ce`). Where something is **not** implemented, the answer explains the concept and admits the limitation. Never claim features that do not exist.
>
> Tip: keep answers to 2–4 sentences. Offer to show the code or the file if asked for more.

---

## A. Application Functionality

**Q1. Why did you choose this project?**
Appointment booking is a familiar, real-world problem, and it naturally splits into separate modules (clients, appointments, admin) that ten people can own. It is small enough to finish and test properly, so we could spend our effort on the DevOps workflow, which is the focus of this lab.

**Q2. What can the system actually do?**
Register clients; list them and fetch one by ID; book appointments for registered clients; list them and fetch one by ID; and, as admin, change an appointment's status, delete an appointment, delete a client together with all of that client's appointments, and view a dashboard of counts. There is also a health-check endpoint and auto-generated Swagger docs.

**Q3. What happens if I book an appointment for a client who doesn't exist?**
The appointments router checks `clients_db` first and returns **404**: *"Client with ID '…' not found"*. Nothing is stored.

**Q4. What if I register the same client twice?**
The second request returns **400**: *"Client with ID '…' already registered"*. The same rule applies to duplicate appointment IDs.

**Q5. What are the possible appointment statuses?**
New appointments default to `pending`. The admin endpoint is intended for `confirmed` or `cancelled`, and the dashboard counts those three. *Honest limitation:* the API accepts any string as a status today; restricting it with a `Literal`/Enum type is a planned improvement.

**Q6. Is there a user interface?**
Yes. There is a React + Vite web app (*AppointmentHub*) in `frontend/` with pages for registering clients, booking, listing, lookup and an admin dashboard. It calls the same REST API. The main deliverable is the API, which can also be used through Swagger UI at `/docs`.

**Q7. Is there login or authentication?**
No. This is a known limitation: the `/admin` endpoints are open. A real deployment would add OAuth2/JWT with an admin role. FastAPI has built-in security helpers for this.

## B. Architecture & APIs

**Q8. Explain your architecture.**
A single FastAPI application. `main.py` creates the app and includes three routers: `clients`, `appointments` and `admin`. `models.py` holds the Pydantic models. Each router owns an in-memory dictionary, and the appointments and admin routers import the clients and appointments dictionaries to enforce the relationships.

**Q9. What is REST? Which HTTP methods do you use?**
REST exposes resources at URLs and uses HTTP methods as verbs. We use **GET** to read, **POST** to create, **PUT** to update the status, and **DELETE** to remove. Responses are JSON with standard status codes: 200, 400, 404 and 422.

**Q10. What is a 422 error?**
*Unprocessable Entity.* FastAPI returns it automatically when the JSON body does not match the Pydantic model, for example a required field is missing. The response lists each problem field.

**Q11. Where is the data stored? Which database?**
There is no database. Data is kept in Python dictionaries in memory, so it is lost when the server restarts. We chose this to keep the lab simple and the tests fast. Adding PostgreSQL with SQLAlchemy is our first future enhancement.

**Q12. Why FastAPI rather than Flask or Django?**
FastAPI gives automatic request validation through Pydantic and automatic interactive documentation (Swagger/OpenAPI) with very little code, and its type hints make the code self-documenting. Flask would need extra libraries for both; Django is heavier than this project needs.

**Q13. What is CORS and why is it in `main.py`?**
Browsers block a page on one origin (the UI on port 5173) from calling another origin (the API on port 8000) unless the server allows it. The CORS middleware allows it. Currently all origins are allowed, which is fine for a lab but should be restricted in production.

**Q14. How does the dashboard calculate statistics?**
It counts entries in the two dictionaries, then counts appointments whose status is `pending`, `confirmed` or `cancelled`, ignoring case.

## C. Python & Dependencies

**Q15. What is `requirements.txt` for?**
It lists the Python packages the project needs with **exact pinned versions**: FastAPI 0.103.1, Uvicorn 0.23.2, Pydantic 2.3.0, Pytest 7.4.2 and HTTPX 0.25.0. `pip install -r requirements.txt` gives every developer, Jenkins and the Docker image the same environment.

**Q16. Why use a virtual environment?**
It isolates this project's packages from other projects and from the system Python, which avoids version clashes.

**Q17. Which Python version do you need?**
3.9 to 3.12. The Docker image uses 3.9 and we tested with 3.11. Python 3.13+ does not work with the pinned Pydantic 2.3.0 because no pre-built wheel exists for its core library.

**Q18. What is Uvicorn?**
An ASGI web server. FastAPI is the framework that defines the endpoints; Uvicorn is the server that listens on port 8000 and passes HTTP requests to it.

## D. Testing & Pytest

**Q19. How does Pytest help?**
It runs our 19 tests automatically in under a second. If someone breaks a rule (for example, duplicates are no longer rejected), a test fails immediately, so mistakes are caught before deployment. Jenkins runs the same tests.

**Q20. What do your tests cover?**
`test_main.py` (9 tests) covers the full app: health, register, duplicate, list, get, book, unknown client, dashboard and confirm. `test_appointments.py` (10 tests) covers booking success, default status, unknown client, duplicate ID, empty and populated lists, get found and not found, register-then-book, and the 422 case. Not yet covered: the delete endpoints and the `cancelled` count. We have not measured coverage.

**Q21. How do you test an API without starting the server?**
FastAPI's `TestClient`, built on HTTPX, sends real HTTP requests directly to the app object in memory.

**Q22. How do tests avoid affecting each other?**
An `autouse` Pytest fixture clears both in-memory dictionaries before and after every test.

**Q23. What happens when a test fails?**
Locally, Pytest shows which assertion failed and why. In Jenkins, the *Run Tests* stage fails, the pipeline prints "One or more tests failed", and the later stages (Docker build and deploy) **do not run**. Broken code is not packaged or deployed.

## E. Git & GitHub

**Q24. What is the difference between `git commit` and `git push`?**
`git commit` saves a snapshot of the staged changes in your **local** repository. `git push` uploads your local commits to the **remote** repository on GitHub so the team can see them.

**Q25. What is a branch? What branching strategy did you use?**
A branch is an independent line of development. Our charter planned GitFlow (`main`, `develop`, `feature/*`). In practice each member worked on a feature branch, such as `feature/S4`, `feature/S5` or `feature/S9`, and merged through a pull request into our integration branch `feature/1`, which is the repository's default branch.

**Q26. What is a pull request?**
A request to merge one branch into another. On GitHub it shows the changes, allows discussion and review, and records who merged what. We had 8 PRs; 6 were merged.

**Q27. What is `.gitignore`?**
A list of files Git should not track: virtual environments, `__pycache__`, `.pytest_cache`, `node_modules`, build output, `.env` files and keys. It keeps the repository clean and keeps secrets out.

**Q28. What is a merge conflict and how do you resolve it?**
It happens when two branches change the same lines differently. Git marks the conflict and a person chooses the final content. *Our real example:* during one web-based conflict resolution, stray formatting lines were left in two files. The lesson is to re-run the tests after resolving a conflict, and to have CI run automatically on every pull request.

**Q29. Did you use code reviews / branch protection?**
Pull requests were used for every module, but GitHub shows no formal review approvals, and most PRs were merged by their author. Enabling branch protection with a required approval and a passing CI check is one of our improvement items.

## F. Jenkins & CI/CD

**Q30. What is the difference between Continuous Integration and Continuous Deployment?**
**CI:** every change is automatically built and tested, so integration problems are found early. **Continuous Delivery:** the tested code is automatically packaged and ready to release. **Continuous Deployment:** it is also released to the environment automatically, without manual approval. Our Jenkinsfile covers CI (install, test, compile check) and attempts delivery and deployment (Docker build, `kubectl apply`).

**Q31. What is the role of the Jenkinsfile?**
It defines the pipeline **as code** in the repository: the stages, their order, and what happens on success or failure. Anyone can see, version and review the pipeline like any other code.

**Q32. What are your pipeline stages?**
Checkout → Install Dependencies → Run Tests → Code Quality Check (`py_compile` on all modules) → Build Docker Image (tagged `v<build number>` and `latest`) → Deploy to Kubernetes (`kubectl apply`), plus post-build success, failure and always messages.

**Q33. Why `bat` instead of `sh`?**
Our Jenkins agent runs on Windows, which uses batch commands. The commit history shows this change (`fdd701e`). The Python path is hard-coded for that machine, so it must be edited for another computer.

**Q34. Did the Jenkins pipeline really build and deploy?**
*Answer honestly.* The pipeline was run and adjusted on a Windows Jenkins machine, as the fix commits show. The Docker and Kubernetes stages are wrapped in try/catch: if Docker or kubectl is unavailable, they print a "simulated" message instead of failing. A green build therefore proves that install, tests and compile check passed; it does **not** by itself prove the image was built or deployed. *(Show the console log if you have one.)*

**Q35. How is the pipeline triggered?**
There is no `triggers {}` block in the Jenkinsfile, so it runs when you click **Build Now** or through a trigger configured in the Jenkins job, such as SCM polling or a GitHub webhook.

## G. Docker

**Q36. Why do we use Docker?**
To package the application with its exact runtime and dependencies into an image that runs the same on any machine. It removes "works on my machine" problems and is the unit that Kubernetes deploys.

**Q37. What is the purpose of a Dockerfile?**
It is the recipe for building the image. Ours:
- starts from `python:3.9-slim`,
- installs `requirements.txt` in a builder stage,
- copies only the needed packages and app files into a clean runtime stage,
- creates a non-root user,
- exposes port 8000,
- adds a health check,
- starts Uvicorn.

**Q38. What is a multi-stage build?**
Using more than one `FROM` stage: one stage installs or builds, and the final stage copies only the results. The final image is smaller and contains fewer tools an attacker could use.

**Q39. Image vs container?**
An **image** is the read-only template, like a class. A **container** is a running instance of it, like an object. One image can run many containers.

**Q40. What is `.dockerignore`?**
It excludes files from the build context: tests, docs, `.git`, `k8s/`, the Jenkinsfile, virtual environments, `node_modules` and secret files. Builds are faster, images are smaller, and secrets never get copied in.

**Q41. What does docker-compose do here?**
It starts two containers together: the `api` on port 8000 and the `frontend` (Nginx) on port 5173. They share a network, and the frontend waits until the API is healthy. One command: `docker compose up --build`.

## H. Kubernetes

**Q42. Why are the Kubernetes Deployment and Service separate?**
They solve different problems. The **Deployment** manages *running* the pods: how many replicas, which image, rolling updates, health probes, and restarting failed pods. The **Service** manages *reaching* the pods: one stable name and IP that load-balances across whichever pods currently exist. Pods are temporary and change IPs; the Service stays the same.

**Q43. Explain your deployment.yaml.**
2 replicas of `appointment-booking-api:latest` on port 8000. Rolling updates with `maxUnavailable: 0`, so there is no downtime during updates. CPU and memory requests and limits. A readiness probe and a liveness probe, both calling `GET /`.

**Q44. Readiness vs liveness probe?**
**Readiness:** "Can this pod receive traffic yet?" If it fails, the pod is removed from the Service. **Liveness:** "Is this pod still healthy?" If it fails repeatedly, Kubernetes restarts the container.

**Q45. Explain your service.yaml.**
A `LoadBalancer` Service named `appointment-booking-service` selects pods labelled `app: appointment-booking-api` and forwards port 80 to container port 8000. On a local cluster we can use `kubectl port-forward` or `minikube service` instead.

**Q46. Did you deploy it to a cluster? Which cloud?**
*Answer honestly.* We wrote the manifests for a local cluster (Docker Desktop Kubernetes or Minikube); no cloud provider is used. The image is built locally and is not pushed to a registry. *(Only say it was deployed if you have actually run `kubectl apply` and can show `kubectl get pods`.)*

**Q47. Is there any problem with 2 replicas and your design?**
Yes. Because data is stored in memory, each pod has its **own** data, so a client registered through one pod may not be visible through the other. A shared database is needed before scaling out. For a demo, scale to 1 replica.

## I. Team Collaboration

**Q48. How did you divide the work among ten members?**
Into ten responsibilities:
- the Team Lead (architecture and charter),
- three API developers (clients, appointments, admin with `main.py`),
- QA (tests and dependencies),
- Git/GitHub,
- Jenkins,
- Docker,
- Kubernetes,
- final documentation.

Each owned specific files, worked on a branch and merged through a pull request. The modules were merged in dependency order: clients → appointments → admin.

**Q49. How can you show who did what?**
The Git history: commit authors, files changed and pull requests. Our `docs/TEAM_CONTRIBUTION_AUDIT.md` maps each member to the commits and files that support their role, and clearly marks anything that is not visible in Git.

**Q50. Did everyone write code?**
No, and we did not plan it that way. Three members wrote the API modules, one wrote the main test suite, and the others owned DevOps configuration, repository management or documentation. Those roles are just as essential to a DevOps project.

**Q51. What was your biggest collaboration challenge?**
Integration. Several members touched shared files like `main.py` and the test file, which caused merge conflicts. One conflict resolution left stray lines in two files, which taught us to run tests on every pull request before merging.

## J. Documentation

**Q52. How can someone reproduce your project on another computer?**
Follow the README:
1. Clone the repository.
2. Create a virtual environment with Python 3.9–3.12.
3. `pip install -r requirements.txt`
4. `uvicorn main:app --reload --port 8000`
5. Open `/docs`.
6. Run `python -m pytest test_main.py test_appointments.py -v`.

Or use Docker (`docker compose up --build`) without installing Python at all.

**Q53. What documentation does the project have?**
- `README.md`: user guide, API reference, examples, Docker, Jenkins and K8s steps, troubleshooting.
- `docs/Project_Architecture.md`
- `docs/Team_Charter.md`
- `docs/TEAM_CONTRIBUTION_AUDIT.md`
- `docs/Docker_Containerization_Guide.md`
- `frontend/README.md`
- The automatic Swagger and ReDoc docs.

## K. Limitations & Future Scope

**Q54. What are the current limitations?**
- In-memory data (lost on restart, not shared across replicas).
- No authentication.
- Loose validation of e-mail, date, time and status.
- No double-booking check.
- Delete endpoints untested.
- Jenkins tied to one Windows machine, and its Docker/K8s stages hide failures.
- Images not pushed to a registry.

**Q55. What would you add next?**
1. PostgreSQL with SQLAlchemy.
2. JWT authentication with an admin role.
3. Strict field types and a status enum.
4. Slot-conflict detection.
5. CI on every pull request with branch protection.
6. Push versioned images to Docker Hub or GHCR.
7. Monitoring with Prometheus and Grafana.

**Q56. Is the project production-ready?**
No. It is a lab project that demonstrates the workflow. The main gaps before production are persistence, authentication, stricter validation and a pipeline that fails on real deployment errors.

---

### If you don't know an answer

Say: *"That's a good question. In our project we haven't implemented that yet, but the way it would work is …"* Or offer to check the code. Never invent a feature, test result or deployment.
