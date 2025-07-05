# 🛠 CI/CD Workflow Overview

This project uses **GitHub Actions** to automate the full integration, validation, and deployment cycle.



---

## 📦  Main Branches

- `main`: production (deployments and releases).
- `develop`: staging/testing environment.

---

## 🧪 Active Workflows

Each file is located in `.github/workflows/`.

| Workflow          | Description                                                       | Runs on            |
|------------------|-------------------------------------------------------------------|----------------------|
| `lint.yml`        | 	Runs ESLint to ensure code style and quality.                  | Push/PR              |
| `build.yml`       | Builds the project and checks for build-time errors.             | PR to `main`/`develop`|
| `coverage.yml`    | Runs tests with coverage. Fails if any metric is below 90%. Posts coverage report as a PR comment.           | PR to `main`/`develop`|
| `audit.yml`       | Audits dependencies for vulnerabilities.                         | PR                   |
| `swagger-comment.yml` | Posts a comment with a link to the public Swagger documentation.      | PR                   |
| `cleanup.yml`     | Automatically deletes branches after a PR is merged.             | PR merged            |

---

## 📊 Expected Coverage

The pipeline fails if **any** of the following is below 90%:

- Statements
- Branches
- Functions
- Lines

Results are posted as an automatic comment on each PR.

---

## 🚀 Deployment



- Deployment is currently handled externally. (eg: [Render](https://render.com)).
- The `release.yml` workflow generates semantic version tags on changes to `main`.

---

## 📘 Technical Documentation

- Swagger is available at:
  [`https://api-store-eqff.onrender.com/docs#/`](https://api-store-eqff.onrender.com/docs#/)

---

## 🧼 Recommendations

- Use conventional commit messages (`feat:`, `fix:`, `chore:`) to enable `semantic-release` automation.
- Never push directly to `main`. Use Pull Requests.
- Keep `package-lock.json` up to date.

---

## 🤖  Running Workflows Locally

It is recommended to install [`act`](https://github.com/nektos/act) to simulate GitHub Actions locally:

```bash
brew install act
act -j test
```