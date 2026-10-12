# Team Contribution Audit (Evidence from Git & GitHub History)

> **Purpose:** to record, factually and fairly, which parts of the repository are backed by commit and pull-request evidence, so that the Team Charter, README and presentation do not over- or under-state anyone's work.
>
> **Prepared by:** Vighnesh Shinde (2303057), documentation owner, in coordination with the Team Lead, Shweta Lokhande (2303059).
> **Data collected:** 2026-10-12, from a fresh clone of `https://github.com/krushh67/client-appointment-booking-system` (all 11 remote branches) and the GitHub pull-request list.
> **Commands used:** `git log --all --format=fuller`, `git log --all --stat/--numstat`, `git shortlog -sne --all`, `git log --follow -- <file>`, `git show <hash>`, `git diff`, `gh pr list/view`.

---

## 1. How to read this audit

- **Git author name/e-mail is metadata, not proof of identity.** Anyone can set any name in `git config`. Shared laptops, pair programming, squash merges and copied commits all blur authorship.
- **A commit message is not proof that a feature works.** Functionality claims below are based on reading the diff and on test runs.
- **Absence of commits is not absence of work.** Planning, reviewing, testing on a machine, debugging help, viva preparation and repository administration often leave no commits.
- **Personal e-mail addresses are deliberately not reproduced** here. Authors are identified by the commit display name and/or GitHub username.
- **Confidence levels:**
  - **High:** the commit display name matches the roster name, the diff matches the role, and a GitHub account/PR corroborates it.
  - **Medium:** strong but indirect evidence, such as a nickname, an alias, or work done through another person's commit.
  - **Low:** circumstantial evidence only.
  - **Unverified:** no evidence in the repository.

## 2. Development history summary

- **2026-10-07, morning:** Shweta Lokhande creates the first five commits: the Team Charter and Project Architecture documents. These are the **root commits** of the repository, on the branch `feature/1`, which became the **default (integration) branch**.
- **2026-10-07, afternoon:**
  - Apurva Chothe builds the Pydantic models and the clients router.
  - Mayuri Masal builds the appointments router and its test file, on top of Apurva's commits.
  - Mansi Patil builds the admin router and `main.py`, on top of both.
  - This stacked chain is merged into `feature/1` as **PR #1** (12 commits).
  - Vedika adds `requirements.txt` and `test_main.py` (**PR #2**).
- **2026-10-09:** Mayuri adds a complete React frontend and updates `main.py`, `routers/admin.py`, `requirements.txt`, `test_main.py` and `.gitignore` (commit `3d2f728`, branch `feature/S3-new`).
- **2026-10-10 to 10-11:** Suryakant Koli (commit name "Suryaaa") develops the `Jenkinsfile` in small steps, including Windows-agent fixes, then the Docker assets. These commits are on the `main` branch, which had diverged from `feature/1`.
- **2026-10-12:**
  - Prathamesh Patil adds the Kubernetes manifests (**PR #3**).
  - `main` is merged into `feature/1` (**PR #7**; PR #6 is marked merged by the same commits).
  - The frontend branch is updated from `feature/1` through GitHub's web UI (merge commit `e688f27`) and merged (**PR #8**). That merge's conflict resolution damaged three files (see §7).

**Totals:** 39 commits on all branches (32 non-merge, 7 merge), 8 pull requests (6 merged, 2 closed), 10 GitHub collaborators.

## 3. Chronological timeline of important commits

Times are IST (+05:30). "PR" is the pull request through which the commit reached `feature/1`.

| Date & time | Commit | Author (commit name) | What changed | PR |
|---|---|---|---|---|
| 10-07 12:46 | `a816a07` | Shweta_Lokhande | `docs/Team_Charter.md` created: purpose and role table | (root) |
| 10-07 12:50 | `09aa912` | Shweta_Lokhande | Team Charter: GitFlow branching and PR workflow | (root) |
| 10-07 12:51 | `b4d14db` | Shweta_Lokhande | `docs/Project_Architecture.md` created: tech-stack table | (root) |
| 10-07 12:53 | `c7031c0` | Shweta_Lokhande | Mermaid architecture and CI/CD diagrams | (root) |
| 10-07 12:54 | `ae55897` | Shweta_Lokhande | Cross-links between the two documents | (root) |
| 10-07 13:40 | `d557025` | Apurva Chothe | `models.py` (`Client`, `Appointment`, `StatusUpdate`), `routers/__init__.py` | #1 |
| 10-07 13:41–13:48 | `10e2950`, `0ad5829`, `0fe5b75`, `188214e` | Apurva Chothe | `routers/clients.py`: register, list, get-by-ID, `400`/`404` handling, field metadata, docstrings | #1 |
| 10-07 14:41–14:45 | `f7f4fbd`, `37624b0`, `c0284e5` | Mayuri Masal | `routers/appointments.py`: store, booking with client-existence check, list and get-by-ID | #1 |
| 10-07 14:49 | `3abdfc8` | Mayuri Masal | `test_appointments.py`: 10 tests | #1 |
| 10-07 14:50 | `c300418` | Mayuri Masal | OpenAPI response schemas and docstrings for appointments | #1 |
| 10-07 16:30 | `6fc9838` | Mansi Patil | `routers/admin.py`: status update, delete appointment, delete client (cascade), dashboard | #1 |
| 10-07 16:57 | `57b182c` | Mansi Patil | `main.py`: FastAPI app, router registration, health check | #1 |
| 10-07 18:22 | `cf79cc3` | Vedika | `requirements.txt` (pinned) and `test_main.py` (integration tests) | #2 |
| 10-09 14:26 | `3d2f728` | Mayuri Masal | React + Vite frontend (`frontend/`, 32 files) plus CORS in `main.py`, admin/test/requirements updates, `.gitignore` | #8 |
| 10-10 23:36–23:37 | `f8e3671`, `7568a8c`, `c773064`, `967b175` | Suryaaa | `Jenkinsfile`: structure, install/test, Docker/K8s stages, post-actions | #7 |
| 10-10 23:45 – 10-11 00:15 | `fdd701e`, `b12bd4d`, `e171605`, `d91c4c9`, `3a41b90` | Suryaaa | Windows Jenkins fixes (`bat`, absolute paths), first `Dockerfile`/`.dockerignore`, Docker-build fallback | #7 |
| 10-11 12:04 | `d9119f4` | Suryaaa | `Jenkinsfile` v2: code-quality stage, test post-actions, K8s fallback | #7 |
| 10-11 13:30 | `2cb14ae` | Suryaaa | Multi-stage `Dockerfile`, `.dockerignore`, `docker-compose.yml`, `frontend/Dockerfile`, `nginx.conf`, Docker guide, expanded `.gitignore`. It **also carries a copy of the frontend source identical to Mayuri's `3d2f728`** | #7 |
| 10-12 16:33 | `2f76f62` | Prathamesh Patil | `k8s/deployment.yaml`, `k8s/service.yaml` | #3 |
| 10-12 21:01 | `673fb73` | Suryaaa | Frontend `rollup` → `@rollup/wasm-node` override for build compatibility | #7 |
| 10-12 21:09 | `3ebf8d8` | Suryaaa | Merge `feature/1` into `main` ("sync … Role S7, S8, and S9") | #6/#7 |
| 10-12 21:57 | `e688f27` | Krushnali Patil (GitHub web UI) | Merge `feature/1` into `feature/S3-new` with conflict resolution: **introduced the broken lines described in §7** | #8 |
| 10-12 22:06 | `b5030ce` | Mayuri Masal (GitHub) | Merge PR #8 into `feature/1` (current HEAD) | #8 |

### Pull requests

| PR | Branch → base | Opened by (GitHub) | Merged by | Formal reviews |
|---|---|---|---|---|
| #1 | `feature/S4` → `feature/1` | MansiPatil14 | MansiPatil14 | 0 |
| #2 | `feature/S5` → `feature/1` | Vedika135 | krushh67 | 0 |
| #3 | `feature/S9` → `feature/1` | Prathamesh79097 | Prathamesh79097 | 0 |
| #4 | `frontend` → `feature/1` | Mayuri3329 | *closed, not merged* | 0 |
| #5 | `feature/S3` → `feature/1` | Mayuri3329 | *closed, not merged* | 0 |
| #6 | `feature/7` → `feature/1` | Suryaaa27 | Suryaaa27 | 0 |
| #7 | `main` → `feature/1` | Suryaaa27 | Suryaaa27 | 0 |
| #8 | `feature/S3-new` → `feature/1` | Mayuri3329 | Mayuri3329 | 0 |

Observation: every PR was merged **without a recorded GitHub review**, and most were merged by their own author. Branch-protection settings could not be read with a non-admin account. The self-merges suggest that reviews were not enforced.

## 4. Contribution table: all ten members

| # | Student (PRN) | Commit identity / GitHub account | Key commits | Files (added / modified) | Functionality evidenced | Official / planned role | Role best supported by evidence | Confidence | Mismatch / notes |
|---|---|---|---|---|---|---|---|---|---|
| 1 | **Shweta Lokhande** (2303059) | `Shweta_Lokhande` (college e-mail containing her PRN); GitHub `Shwetaml108` (collaborator) | `a816a07`, `09aa912`, `b4d14db`, `c7031c0`, `ae55897` | **A:** `docs/Team_Charter.md`, `docs/Project_Architecture.md` | Team charter, role matrix, GitFlow/PR policy, tech-stack table, Mermaid architecture and CI/CD diagrams | **Team Lead (S1):** architecture & Team Charter | Team Lead / S1 documentation | **High** | None. Her commits are the repository's root commits. |
| 2 | **Apurva Chothe** (2303054) | `Apurva Chothe`; GitHub `ApurvaChothe07` | `d557025`, `10e2950`, `0ad5829`, `0fe5b75`, `188214e` | **A:** `models.py`, `routers/__init__.py`, `routers/clients.py` | Pydantic models for all entities; client register/list/get; duplicate → `400`, missing → `404` | *Not stated in the materials received* | **S2:** Client Registration API | **High** | Branches `feature/2` and `feature-Client-Registration-API-module/2` point to her last commit. Reached `feature/1` through PR #1. |
| 3 | **Mayuri J. Masal** (2303047) | `Mayuri Masal`; GitHub `Mayuri3329` | `f7f4fbd`, `37624b0`, `c0284e5`, `3abdfc8`, `c300418`, `3d2f728`; PRs #4, #5, #8 | **A:** `routers/appointments.py`, `test_appointments.py`, `frontend/**` (32 files), `.gitignore`; **M:** `main.py`, `routers/admin.py`, `test_main.py`, `requirements.txt` | Booking with client-existence check, duplicate → `400`; list/get; 10 appointment tests; **complete React UI** (7 pages, Axios API client); CORS | *Not stated* | **S3:** Appointment Booking API; also **frontend developer** (beyond the 10 listed roles) | **High** | The frontend was not one of the 10 planned tasks; it is additional work. Her original `.gitignore` (29 lines) was the repository's first. |
| 4 | **Mansi Patil** (2303050) | `Mansi Patil`; GitHub `MansiPatil14` | `6fc9838`, `57b182c`; opened and merged PR #1 | **A:** `routers/admin.py`, `main.py` | Status update, delete appointment, delete client with cascade, dashboard counts; FastAPI app with router registration and health check | *Not stated* | **S4:** Admin Management API + `main.py` | **High** | PR #1 also carried Apurva's and Mayuri's commits because the branches were stacked. That is not extra authorship by Mansi. |
| 5 | **Vedika Tibugade** (2303048) | commit name `Vedika` (e-mail spelt differently from the roster surname); GitHub `Vedika135` | `cf79cc3`; PR #2 | **A:** `requirements.txt`, `test_main.py` | Pinned dependency list; 9 full-app integration tests | *Not stated* | **S5:** QA, Pytest suite + `requirements.txt` | **High** (only "Vedika" on the roster) | `test_main.py` was later rewritten during the merges (`3d2f728`, `e688f27`); the current file keeps her structure. |
| 6 | **Vaibhav Sutar** (2303056) | No commits under any name resembling his. GitHub collaborator `vsutar1010` exists (likely his account, **unconfirmed**) | none | none | **Not verified from available Git history** | *Not stated* | Cannot be determined from Git | **Unverified** | No commits, PRs or merges. If he held S6 (Git/GitHub), the work may have been done offline or through another account. **Team to confirm.** |
| 7 | **Vighnesh Shinde** (2303057) | `Vighnesh Shinde`; GitHub `Vighnesh-Shinde` (collaborator) | This documentation commit (branch `docs/vighnesh-project-documentation`) | **A:** `README.md`, `docs/TEAM_CONTRIBUTION_AUDIT.md`, `docs/PRESENTATION_*.md`; **M:** `docs/Project_Architecture.md`, `docs/Team_Charter.md` | Final README/user guide, audit, presentation material, expanded Team Lead documents | **S10:** Final `README.md` & user guide (+ completing Team Lead documents with Shweta) | S10 documentation | **High** (after this commit) | No commits before 2026-10-12. |
| 8 | **Krushnali Patil** (2303058) | Account `krushh67`: **owner of the GitHub repository**. GitHub records that account's display name as "Krushnali Patil" on the merges it made | Merge commits `0409b84` (merged PR #2) and `e688f27` (web-UI branch update, PR #8) | No original files; `e688f27` resolved conflicts in `main.py`, `routers/admin.py`, `requirements.txt`, `test_main.py`, `frontend/package*.json` | Repository creation/hosting, collaborator management (10 collaborators), merging | *Not stated* | **Repository owner/maintainer**: closest to S6 Git/GitHub | **Medium** | Did not author `.gitignore`. The conflict resolution in `e688f27` introduced the damage in §7. This is a common merge mistake, recorded here so it can be fixed, not to assign blame. **Team to confirm her official role.** |
| 9 | **Suryakant Koli** (2303049) | commit names `Suryaaa` and `Suryaaa27` (two e-mail spellings: one has a typo in the domain); GitHub `Suryaaa27`. Treated as **one person** (same e-mail local part, same GitHub account) | 12 non-merge commits: `f8e3671` … `d9119f4` (Jenkins), `d91c4c9`, `2cb14ae` (Docker), `673fb73`; merges `3ebf8d8`, `1f2f9ca`; PRs #6, #7 | **A:** `Jenkinsfile`, `Dockerfile`, `.dockerignore`, `docker-compose.yml`, `frontend/Dockerfile`, `frontend/nginx.conf`, `frontend/.dockerignore`, `docs/Docker_Containerization_Guide.md`; **M:** `.gitignore` (expanded), `main.py`, `frontend/package*.json` | 6-stage Jenkins pipeline with Windows-agent fixes; multi-stage, non-root, health-checked API image; Nginx frontend image; Compose stack | *Not stated* | **S7 (Jenkins) and S8 (Docker)** | **High** (S7), **High** (S8) | One person's commits cover **two** planned roles. If S7 or S8 was officially assigned to someone else, that member's work is not visible in Git. **Team to confirm.** `2cb14ae` contains a copy of Mayuri's frontend source (identical to `3d2f728`); the frontend source is credited to Mayuri. |
| 10 | **Prathamesh Patil** (2303060) | `Prathamesh Patil` (two e-mails: personal, and the GitHub no-reply address used for the web merge); GitHub `Prathamesh79097` | `2f76f62`; opened and merged PR #3 (`77b4e06`) | **A:** `k8s/deployment.yaml`, `k8s/service.yaml` | Deployment (2 replicas, rolling update, probes, resource limits) and LoadBalancer Service (80 → 8000) | *Not stated* | **S9:** Kubernetes manifests | **High** | None |

**Official allocation received for this assignment:** only Shweta (Team Lead / S1) and Vighnesh (S10) were explicitly mapped. The role-ID table (S1–S10) and the roster are two separate lists, and the evidence above shows that **roster order does not equal role order**. For example, Shweta is 9th on the roster but S1.

## 5. Evidence-based role mapping

| Role | Responsibility | Member(s) supported by evidence | Status |
|---|---|---|---|
| S1 | Architecture & Team Charter docs | Shweta Lokhande | ✅ Verified (official) |
| S2 | Client Registration API | Apurva Chothe | ✅ Verified by commits |
| S3 | Appointment Booking API | Mayuri J. Masal | ✅ Verified by commits |
| S4 | Admin API + `main.py` | Mansi Patil | ✅ Verified by commits |
| S5 | Pytest suite + `requirements.txt` | Vedika Tibugade | ✅ Verified by commits |
| S6 | `.gitignore` + branching strategy | *Unclear.* `.gitignore` was written by Mayuri (`3d2f728`) and expanded by Suryakant (`2cb14ae`); the branching policy was written by Shweta (`09aa912`); the repository is owned and administered by Krushnali's account | ❓ **Needs team confirmation** (Krushnali Patil and/or Vaibhav Sutar) |
| S7 | Jenkins pipeline | Suryakant Koli | ✅ Verified by commits |
| S8 | Docker | Suryakant Koli | ✅ Verified by commits (see the note on two roles) |
| S9 | Kubernetes manifests | Prathamesh Patil | ✅ Verified by commits |
| S10 | README & user guide | Vighnesh Shinde | ✅ This commit (official) |
| Extra | React frontend | Mayuri J. Masal | ✅ Verified (`3d2f728`) |

## 6. Important files and their contributors

| File | Created by | Later modified by |
|---|---|---|
| `docs/Team_Charter.md`, `docs/Project_Architecture.md` | Shweta | Vighnesh (this commit) |
| `models.py`, `routers/clients.py`, `routers/__init__.py` | Apurva | – |
| `routers/appointments.py`, `test_appointments.py` | Mayuri | – |
| `routers/admin.py` | Mansi (`6fc9838`) | Mayuri (`3d2f728`); merge `e688f27` (broken) |
| `main.py` | Mansi (`57b182c`) | Mayuri (`3d2f728`, CORS); Suryakant (`2cb14ae`); merge `e688f27` |
| `requirements.txt`, `test_main.py` | Vedika (`cf79cc3`) | Mayuri (`3d2f728`); merge `e688f27` (requirements broken) |
| `frontend/**` source | Mayuri (`3d2f728`) | identical copy committed in `2cb14ae`; `673fb73` (package files); merge `e688f27` (lock file broken) |
| `.gitignore` | Mayuri (`3d2f728`) | Suryakant (`2cb14ae`); merge `e688f27` |
| `Jenkinsfile` | Suryakant | – |
| `Dockerfile`, `.dockerignore`, `docker-compose.yml`, `frontend/Dockerfile`, `frontend/nginx.conf`, `docs/Docker_Containerization_Guide.md` | Suryakant | – |
| `k8s/deployment.yaml`, `k8s/service.yaml` | Prathamesh | – |
| `README.md`, `docs/TEAM_CONTRIBUTION_AUDIT.md`, `docs/PRESENTATION_*.md` | Vighnesh (this commit) | – |

## 7. Integration issue found during the audit

Merge commit `e688f27` updated `feature/S3-new` with `feature/1` in GitHub's web conflict editor. The resolved versions of three files contain text that is not valid for their format:

| File | Problem | Consequence (verified) |
|---|---|---|
| `routers/admin.py` | first line ` ```python `, last line ` ``` ` | `SyntaxError`; app and `test_main.py` fail to load |
| `requirements.txt` | first line ` ```text `, last line ` ``` ` | `pip install` fails: *Invalid requirement* |
| `frontend/package-lock.json` | broken `devDependencies` block; invalid JSON | `npm ci` and the frontend Docker build fail |

Both parent versions of each file were valid; only the merge result is damaged. PR #8 was then merged into `feature/1` without a CI check, so the damage reached the integration branch. With only the stray lines removed, **all 19 tests pass**. The fix steps are in [README §8](../README.md#8-known-issue-on-the-current-branch-read-first). This documentation commit does **not** modify application code.

## 8. Planned vs observed: differences

| Area | Planned (Team Charter, 2026-10-07) | Observed in the repository |
|---|---|---|
| Branch model | GitFlow: protected `main`, `develop` integration branch, `feature/<role-id>` branches | No `develop` branch. **`feature/1` is the default and integration branch.** Branch names are mixed (`feature/S4`, `feature/S5`, `feature/S9`, `feature/S3-new`, `feature/2`, `feature/7`, `feature/8`, …). Jenkins/Docker work was committed directly on `main`, then merged into `feature/1`. |
| Reviews | ≥ 1 peer approval; Team Lead approves and merges | 0 recorded reviews; most PRs self-merged |
| CI gate | PRs must pass Pytest and the Docker build | No GitHub Actions; Jenkins is not linked to PR status. Broken code was merged (§7). |
| "No one modifies another role's files" | – | Several shared files were edited by more than one member (`main.py`, `admin.py`, `test_main.py`), which is normal for integration but caused the merge conflict |
| Roles | 10 roles, 1 per member | 8 members have commits; one member's commits cover 2 roles (S7 + S8); one member has none; frontend added as extra scope |

## 9. Attribution limitations

1. Only Git metadata and GitHub PR data were examined. Offline work, chat, screen-sharing and help on someone else's machine are invisible.
2. The `krushh67` → Krushnali Patil and `vsutar1010` → Vaibhav Sutar mappings are inferred from account display names and usernames, not confirmed.
3. "Suryaaa" → Suryakant Koli is inferred from the e-mail local part and the GitHub account (`Suryaaa27`); it is consistent across 14 commits.
4. Line counts overstate some work (for example, `package-lock.json` is 3,000+ generated lines) and understate other work (Jenkins debugging).
5. The Jenkins commit messages show the pipeline being run on a Windows agent, but no build logs are in the repository, so successful runs cannot be verified from Git.

## 10. Summary for the Team Lead's presentation

> "Our repository history shows how the work was actually divided.
> - I set up the documentation first: the Team Charter and Architecture are the first commits.
> - Apurva built the client module and data models. Mayuri built the appointment module, its tests and the React frontend. Mansi built the admin module and wired everything together in `main.py`. Vedika added the integration test suite and the dependency file.
> - Suryakant built the Jenkins pipeline and the Docker setup. Prathamesh wrote the Kubernetes manifests. Krushnali hosts and administers the GitHub repository. Vighnesh wrote the final README and documentation.
> - Each module came in through a feature branch and a pull request into our integration branch, `feature/1`.
> - We also learned from our history: one web-based merge-conflict resolution left stray lines in three files. That is exactly the kind of problem a CI check on every pull request is meant to catch, and it is our first improvement item."

*(Adjust the sentences about S6, S7/S8 and Vaibhav once the team confirms the official allocation.)*
