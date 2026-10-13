# Presentation Script: Team Lead (Shweta Lokhande)

> **Project:** Client Appointment Booking System · DevOps Lab · Final-year B.Tech CSE
> **Speaker:** Shweta Lokhande (2303059), Team Lead
> **Target length:** about 8–9 minutes of speaking, plus a 2–3 minute live demo
> **Prepared by:** Vighnesh Shinde (2303057) for the Team Lead, based on the actual repository (branch `feature/1`, commit `b5030ce`)
>
> **How to use this script**
> - Plain text is what you **say**.
> - Lines in *[italic brackets]* are **actions** (switch screen, run a command).
> - ⏱ marks show roughly how much time each part takes.
> - 🔁 lines are transitions to the next part.
> - Before speaking, read [PRESENTATION_CHECKLIST.md](PRESENTATION_CHECKLIST.md). Part 3 assumes the broken-files fix from README §8 has been applied **or** that you are using the fallback.

---

## Part 1 · Opening & Introduction ⏱ 0:45

Good morning, respected ma'am/sir, and my dear friends.

I am **Shweta Lokhande**, PRN 2303059, and I am the **Team Lead** of our ten-member group. Today we are presenting our DevOps Lab project: the **Client Appointment Booking System**.

We chose this project for two reasons.

- First, appointment booking is a problem everyone understands. Every clinic, salon or consultant needs to know who their clients are and when they are coming.
- Second, the application is small enough to finish properly, but it has enough parts (registration, booking, admin) to let us practise the full DevOps cycle: Git, testing, Jenkins, Docker and Kubernetes. In this lab, the application is the vehicle; the DevOps workflow is what we really wanted to learn.

🔁 *Let me start with the problem we are solving.*

---

## Part 2 · Problem Statement & Objectives ⏱ 0:45

Many small businesses still manage bookings in a notebook or a spreadsheet. That leads to three problems:

- appointments booked for people who are not even registered,
- duplicate entries,
- no quick way to see how many appointments are pending, confirmed or cancelled.

Our system solves this with a REST API that does the following:

1. **Registers clients** with a unique client ID.
2. **Books appointments only for registered clients.** If the client does not exist, the booking is rejected with a 404 error.
3. **Rejects duplicates.** The same client ID or appointment ID cannot be added twice.
4. **Gives the admin control.** The admin can confirm or cancel an appointment, delete records, and see a dashboard with the totals.

Our DevOps objective was to take this API from code on a laptop to an automatically tested, containerised and deployable service.

🔁 *Rather than just describing it, let me show you the application running.*

---

## Part 3 · Application Demonstration ⏱ 2:30

*[Terminal already open in the project folder, virtual environment activated.]*

I start the server with one command:

```bash
uvicorn main:app --reload --port 8000
```

*[Open http://localhost:8000/ in the browser.]*

This is our health-check endpoint. It returns "status ok, Appointment Booking API is running". Docker and Kubernetes use this same endpoint to check whether the application is healthy.

*[Open http://localhost:8000/docs.]*

This page is the **Swagger UI**. FastAPI generates it automatically from our code. You can see four groups: System, Client Management, Appointments and Admin Management.

**Step 1: register a client.** *[POST /clients → Try it out → paste the body → Execute.]*

```json
{"client_id":"client-001","name":"Alice Smith","email":"alice@example.com","phone":"+91-9876543210","registered_at":"2026-10-12T10:00:00Z"}
```

We get 200 OK, and the client is stored. *[Click Execute again.]* If I send the same request again, we get **400: "Client with ID 'client-001' already registered."** So duplicates are blocked.

**Step 2: book an appointment.** *[POST /appointments.]*

```json
{"appointment_id":"apt-101","client_id":"client-001","service_type":"General Consultation","date":"2026-10-15","time":"14:30"}
```

The appointment is created, and notice that the status is **"pending"** by default. *[Change client_id to "ghost" and execute.]* If I try to book for a client who does not exist, the API returns **404: client not found**. This is the link between the two modules: the appointment module checks the client module's data before booking.

*[Delete the "date" and "time" lines and execute.]* If I leave out required fields, FastAPI and Pydantic return **422** and tell me exactly which fields are missing. We did not write that validation by hand; it comes from our data models.

**Step 3: admin.** *[PUT /admin/appointments/apt-101/status with {"status":"confirmed"}.]* The admin confirms the appointment. *[GET /admin/dashboard.]* The dashboard now shows 1 client, 1 appointment, and 1 confirmed.

*(Optional, if the frontend is running.)* *[Switch to http://localhost:5173.]* We also have a React web interface built on the same API, with pages for registering clients, booking, looking up appointments and an admin dashboard. It is an extra on top of our ten planned tasks.

🔁 *Now let me explain what is happening behind the scenes.*

---

## Part 4 · Architecture & Technology Stack ⏱ 1:15

*[Show the architecture diagram from docs/Project_Architecture.md or README §6.]*

Our backend is written in **Python** using **FastAPI**, and it is served by **Uvicorn** on port 8000.

The code is split into modules, one per team responsibility:

- `models.py` defines the data structures using **Pydantic**: Client, Appointment and StatusUpdate.
- `routers/clients.py` handles registration and lookup.
- `routers/appointments.py` handles booking and checks that the client exists.
- `routers/admin.py` handles status changes, deletions and the dashboard.
- `main.py` is the entry point. It joins the three routers into one application and adds the health check.

When a request comes in, FastAPI sends it to the right router. Pydantic validates the JSON. The router applies our business rules and reads or writes the data store.

I want to be clear about one design decision: we store data **in memory**, in Python dictionaries. That keeps the lab project simple and the tests fast, but data is lost when the server restarts. Replacing it with a database is our first future improvement.

🔁 *That is the application. Now, the main focus of this lab: DevOps.*

---

## Part 5 · DevOps Lab Relevance ⏱ 2:00

Our workflow moves code through five steps: **Git → Test → Jenkins → Docker → Kubernetes**. For each tool, I will tell you honestly what we configured, what we have actually run, and what is still unverified.

**Git and GitHub.** Our repository is on GitHub. Each module was developed on its own branch and merged through a **pull request**. We had eight pull requests. Our integration branch is `feature/1`. The commit history shows each member's work, which I will come to in a moment.

**Pytest.** We have **19 automated tests** in two files. They test every success path and the important error cases: 400, 404 and 422. FastAPI's TestClient lets us send real HTTP requests without starting a server, so the tests run in under a second.

**Dependency management.** `requirements.txt` pins exact versions of FastAPI, Uvicorn, Pydantic, Pytest and HTTPX, so every machine installs the same thing.

**Jenkins: CI/CD.** CI, *continuous integration*, means every change is automatically installed and tested. CD, *continuous delivery or deployment*, means the tested code is automatically packaged and released. Our `Jenkinsfile` defines six stages:

1. Checkout
2. Install Dependencies
3. Run Tests
4. Code Quality Check, which compiles every Python file
5. Build Docker Image
6. Deploy to Kubernetes

If the tests fail, the pipeline stops. The commit history shows Suryakant adapting the pipeline to a Windows Jenkins machine, using `bat` commands and fixed paths. One honest limitation: in our pipeline, the Docker and Kubernetes stages print a "simulated" message if Docker or kubectl is not available, so a green build does not by itself prove that an image was deployed.

**Docker.** Docker packages our application with its exact Python version and libraries, so it runs the same everywhere. Our Dockerfile uses a **multi-stage build** to keep the image small, runs as a **non-root user** for security, and has a **health check** on our `/` endpoint. Docker Compose starts the API and the web UI together with one command.

**Kubernetes.** Kubernetes runs and manages containers. Our `deployment.yaml` asks for **two replicas** with rolling updates, CPU and memory limits, and readiness and liveness probes. If a pod stops responding, Kubernetes restarts it. Our `service.yaml` gives those pods one stable address on port 80 and forwards traffic to port 8000. The Deployment and Service are separate because the Deployment manages *running* the pods, while the Service manages *reaching* them. Pods come and go, but the Service address stays the same.

**Documentation.** Finally, the README, architecture document and this charter mean anyone can clone the repository and reproduce our work.

🔁 *A project of this size only works if the team is organised, so let me explain how we divided it.*

---

## Part 6 · Team Contribution ⏱ 1:15

We split the project into **ten responsibilities**: three for application modules, one for testing, five for DevOps tools and documentation, and one for leadership. That way each person owned something specific and we could work in parallel.

According to our commit history:

- I wrote the **project architecture and team charter**. They are the first commits in the repository.
- **Apurva** built the data models and the **client registration** module.
- **Mayuri** built the **appointment booking** module and its tests. She also built the **React frontend**, which was extra.
- **Mansi** built the **admin module** and `main.py`, which joins everything together.
- **Vedika** wrote the main **Pytest suite** and `requirements.txt`.
- **Suryakant** built the **Jenkins pipeline** and the **Docker** setup.
- **Prathamesh** wrote the **Kubernetes** manifests.
- **Krushnali** owns and manages our **GitHub repository**.
- **Vighnesh** wrote the final **README and user guide**, and helped me complete the documentation.

*[Only if the team has confirmed it, add one sentence about Vaibhav's role. Otherwise say:]* The Git/GitHub role also covered repository setup and branch policy, and not all of that work shows up as commits.

The modules depend on each other: appointments need clients, and admin needs both. So we merged them in that order, through pull requests, into our integration branch.

🔁 *Now, how do we know it works? Testing and results.*

---

## Part 7 · Testing & Results ⏱ 0:45

*[Run in terminal.]*

```bash
python -m pytest test_main.py test_appointments.py -v
```

*[Point at the output.]* All **19 tests pass** in under a second.

- Nine of them test the complete application: health check, registration, duplicates, booking, missing client, dashboard and confirming an appointment.
- The other ten focus on appointment booking: default status, duplicates, lookups, a full register-then-book flow, and invalid input.

To be precise about what we have **not** measured: we have not run a coverage report, and the two delete endpoints do not have tests yet. That is on our improvement list.

> *Speaker note: only say "all 19 pass" if you ran it on the fixed code that morning. If the fix was **not** merged, say: "On our final branch, a merge left a few stray lines in two files. With those lines removed, all 19 tests pass, and the fix is a four-line change." Do not claim a pass you have not seen.*

🔁 *That leads me to what we learned.*

---

## Part 8 · Challenges & Learning Outcomes ⏱ 0:45

A few real challenges from our repository:

- **Running Jenkins on Windows.** Linux `sh` steps had to become `bat`, and tools needed absolute paths. You can see each fix as a separate commit.
- **Integrating ten people's work.** Some files, like `main.py` and the test file, were touched by several people, which led to merge conflicts. In one web-based conflict resolution, a few stray formatting lines slipped into two files, and the pull request was merged without a CI check. That taught us exactly *why* CI should run on every pull request **before** merging, not after.
- **Stateful data in a replicated deployment.** With two Kubernetes replicas and in-memory storage, each pod has its own data. This showed us why real systems keep state in a shared database.

What we learned:

- how to structure an API into modules,
- how automated tests give confidence,
- how a Jenkinsfile turns manual steps into a pipeline,
- how Docker makes environments reproducible,
- how Kubernetes keeps an application available.

Above all, we learned how a team collaborates through Git.

---

## Part 9 · Limitations & Future Scope ⏱ 0:30

Our current limitations, and what we would do next:

1. **Data is in memory.** We would add a database such as PostgreSQL.
2. **There is no login**, so anyone can call admin APIs. We would add JWT authentication with an admin role.
3. **Email, date, time and status are not strictly validated.** We would use proper types.
4. **There is no check for double-booking the same time slot.** We would add one.
5. **On the DevOps side:** make Jenkins run on every pull request and fail on real Docker or Kubernetes errors, push images to a registry like Docker Hub, and add monitoring.

---

## Part 10 · Conclusion ⏱ 0:20

To conclude: we built a working **Client Appointment Booking System** with client registration, appointment booking and admin management, backed by 19 automated tests. We set it up for a full DevOps workflow with Git and GitHub, a Jenkins pipeline, Docker images and Kubernetes manifests, and we documented it so anyone can reproduce it.

More than the application itself, this project taught ten of us how real software teams build, test and ship code together.

Thank you. We are happy to take your questions.

---

### Timing summary

| Part | Time |
|---|---|
| 1 Opening | 0:45 |
| 2 Problem & objectives | 0:45 |
| 3 Demo | 2:30 |
| 4 Architecture | 1:15 |
| 5 DevOps | 2:00 |
| 6 Team | 1:15 |
| 7 Testing | 0:45 |
| 8 Challenges & learning | 0:45 |
| 9 Limitations | 0:30 |
| 10 Conclusion | 0:20 |
| **Total** | **≈ 10:50**; trim Part 3 or Part 5 if your slot is shorter |

**If you are short on time (≈ 7 min):** skip the optional frontend and the 422 demo in Part 3, shorten Part 5 to one sentence per tool, and merge Parts 8 and 9.
