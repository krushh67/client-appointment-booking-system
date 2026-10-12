# Presentation & Demo Checklist

> Use this the evening before and 30 minutes before the presentation. Commands assume Windows PowerShell from the repository root, unless shown otherwise.

---

## 0. Must-do before presentation day ❗

The current `feature/1` HEAD (`b5030ce`) **will not start**: `routers/admin.py` and `requirements.txt` contain stray ```` ``` ```` lines from merge `e688f27`. Pick **one** option:

- [ ] **Option A (recommended):** a team member fixes it on GitHub through a small PR:
  - delete line 1 and the last line of `routers/admin.py`;
  - delete line 1 and the last line of `requirements.txt`;
  - run `git checkout 673fb73 -- frontend/package-lock.json`.

  Then `git pull` on the demo laptop. See [README §8](../README.md#8-known-issue-on-the-current-branch-read-first).
- [ ] **Option B (local only):** make the same edits on the demo laptop **without committing**, if the team cannot merge a fix in time.
- [ ] After either option, run the tests (step 2.3) and confirm **19 passed**.

## 1. Prerequisites on the demo laptop

| Item | Check command | Expected |
|---|---|---|
| Python **3.9–3.12** (not 3.13/3.14) | `py -0` | 3.10, 3.11 or 3.12 listed |
| Git | `git --version` | any recent version |
| Repo cloned and up to date | `git status` | on `feature/1`, clean |
| Node.js + npm *(UI demo only)* | `node -v` | v18+ |
| Docker Desktop running *(Docker demo only)* | `docker info` | no error |
| Kubernetes enabled *(K8s demo only)* | `kubectl get nodes` | 1 node `Ready` |
| Browser tabs ready | – | `localhost:8000/docs`, GitHub repo, `localhost:5173` |
| Laptop charged, notifications off, font size enlarged in terminal and browser | – | – |

## 2. Setup commands (run before you are called)

```powershell
# 2.1 Get the code
git clone https://github.com/krushh67/client-appointment-booking-system.git
cd client-appointment-booking-system
git checkout feature/1
git pull

# 2.2 Virtual environment + dependencies
py -3.11 -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt

# 2.3 Tests: must print "19 passed"
python -m pytest test_main.py test_appointments.py -v

# 2.4 Start the API (leave this terminal open)
uvicorn main:app --reload --port 8000
```

Optional UI (second terminal):

```powershell
cd frontend
npm install        # not "npm ci" until package-lock.json is fixed
npm run dev        # http://localhost:5173
```

## 3. Safe demo sequence (Swagger UI at http://localhost:8000/docs)

Restart Uvicorn just before the demo so the in-memory data is empty.

| # | Endpoint | Body / action | Expected result | What to say |
|---|---|---|---|---|
| 1 | `GET /` (browser) | – | `{"status":"ok", ...}` | Health check, also used by Docker and K8s probes |
| 2 | `POST /clients` | `{"client_id":"client-001","name":"Alice Smith","email":"alice@example.com","phone":"+91-9876543210","registered_at":"2026-10-12T10:00:00Z"}` | 200 + client | Registration |
| 3 | `POST /clients` | same body again | **400** already registered | Duplicate protection |
| 4 | `POST /appointments` | `{"appointment_id":"apt-101","client_id":"client-001","service_type":"General Consultation","date":"2026-10-15","time":"14:30"}` | 200, `status: "pending"` | Default status |
| 5 | `POST /appointments` | same, with `"appointment_id":"apt-102","client_id":"ghost"` | **404** client not found | Module integration |
| 6 | `POST /appointments` | `{"appointment_id":"apt-103","client_id":"client-001"}` | **422** missing fields | Automatic validation |
| 7 | `PUT /admin/appointments/apt-101/status` | `{"status":"confirmed"}` | 200, `status: "confirmed"` | Admin workflow |
| 8 | `GET /admin/dashboard` | – | 1 client, 1 appointment, 1 confirmed | Dashboard |
| 9 | *(optional)* `DELETE /admin/clients/client-001` then `GET /appointments` | – | message, then `[]` | Cascade delete |
| 10 | *(optional)* UI at `localhost:5173` | register → book → admin page | same data appears | React frontend |

Keep these JSON bodies in a text file so you can paste them, not type them.

## 4. Showing the DevOps artifacts

| Tool | What to show | Where | If it can be run live |
|---|---|---|---|
| Git/GitHub | Branches, 8 pull requests, commit history by member | GitHub → *Pull requests* (closed) and *Insights → Network*; or `git log --oneline --graph --all` | – |
| Pytest | Test files and a passing run | `test_main.py`, `test_appointments.py`; terminal | `python -m pytest -v` |
| Jenkins | The 6 stages in the `Jenkinsfile`; console output or stage view | `Jenkinsfile` on GitHub; Jenkins UI on the machine where it was configured | Only if that Jenkins machine is available. **Edit `PYTHON_PATH` first** if using another PC |
| Docker | Multi-stage `Dockerfile`, `.dockerignore`, `docker-compose.yml` | GitHub / editor | `docker build -t appointment-booking-api:latest .` then `docker run -d -p 8000:8000 --name api appointment-booking-api:latest` and `docker ps` (shows *healthy*) |
| Kubernetes | `deployment.yaml` (2 replicas, probes, limits) and `service.yaml` (80 → 8000) | `k8s/` | `kubectl apply -f k8s/` → `kubectl get pods,svc` → `kubectl port-forward service/appointment-booking-service 8080:80` |
| Docs | README, architecture diagrams (Mermaid renders on GitHub) | GitHub repo page | – |

> For a live K8s demo with in-memory data, run `kubectl scale deployment appointment-booking-api --replicas=1` first, so all requests reach the same pod.

## 5. Evidence and screenshots to prepare tonight

Only collect what you have **actually run**. Label each with the date.

- [ ] Terminal: `19 passed` from Pytest
- [ ] Swagger UI listing all endpoint groups
- [ ] Swagger responses: 200 booking, 404 unknown client, 400 duplicate, dashboard
- [ ] *(if UI)* Home page and Admin Dashboard page of the React app
- [ ] GitHub: closed pull-request list (#1–#8) and the commit graph
- [ ] *(if Jenkins available)* Stage view and console output. Note whether Docker/K8s stages say "Simulating"
- [ ] *(if Docker available)* `docker images` and `docker ps` showing `(healthy)`
- [ ] *(if K8s available)* `kubectl get deployments,pods,svc`
- [ ] Architecture diagram (README §6 or `docs/Project_Architecture.md`)

Put them in one folder or slide so you can switch to them quickly if a live demo fails.

## 6. Fallback plan

| If this fails… | Do this |
|---|---|
| API won't start (`SyntaxError`) | The fix in §0 was not applied. Apply Option B locally (2 minutes), or show the screenshots and say: "Our final merge left stray lines in two files; with them removed all 19 tests pass." |
| `pip install` fails | Wrong Python version (3.13/3.14) → `py -3.11 -m venv venv`. No internet → use a venv prepared the night before. |
| Port 8000 busy | `uvicorn main:app --port 8001` and use `localhost:8001/docs` |
| Swagger page won't load | Use `curl.exe` commands from README §13, or show screenshots |
| Frontend fails | Skip it; the API demo through Swagger is the core |
| Docker Desktop not running / slow | Show the Dockerfile and Compose file and explain them; show screenshots if you have them |
| No Kubernetes cluster | Walk through `deployment.yaml` and `service.yaml` line by line; explain Deployment vs Service; do **not** claim it was deployed |
| Jenkins machine unavailable | Show the `Jenkinsfile` stages on GitHub and the Windows-fix commits as evidence of iteration |
| Projector or laptop problem | Present from the GitHub repository page on any computer: README, `docs/`, PR list |
| Data looks wrong mid-demo | Restart Uvicorn; memory is cleared, so start the sequence again |

## 7. Five-minute pre-demo routine

1. `git pull`, activate the venv, run `python -m pytest test_main.py test_appointments.py -q` and check for `19 passed`.
2. Restart `uvicorn main:app --port 8000` so data is empty.
3. Open the tabs: `/docs`, GitHub repo, *(optional)* `localhost:5173`.
4. Open the JSON snippets file.
5. Zoom the browser to 125–150%, silence your phone, and breathe. 🙂
