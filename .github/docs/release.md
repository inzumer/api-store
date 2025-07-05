# 🚀 Release Process

This document outlines the release workflow for the project, detailing how code changes are merged and released, including backporting to maintenance branches.

---

## 🧭 Branch Strategy for Releases

- **Main branch (`main`)**  
  This is the production branch where all releases are tagged and deployed. All release-ready features and fixes must be merged here.

- **Backport branches**  
  For supporting older versions or maintenance releases, specific branches (e.g., `release/1.x`, `release/2.x`) receive backported fixes.

---

## 🛠 Release Workflow

1. **Develop on feature branches**  
   Developers create feature or fix branches from `develop` or the relevant base.

2. **Create Pull Requests (PRs) to `develop`**  
   Work is integrated and tested in `develop` first.

3. **Merge `develop` into `main` via PR**  
   When ready for release, changes from `develop` are merged into `main`. This triggers the CI/CD pipeline to run tests, build, and create a release tag (using semantic versioning).

4. **Tagging and publishing**  
   The release pipeline automatically creates a Git tag and publishes the release artifacts.

---

## 🔄 Backporting Fixes

- If a bug fix or patch needs to be applied to older release branches:

  1. Create a PR from `main` (or the fix branch) to the specific backport branch (e.g., `release/1.x`).

  2. Run CI tests on the backport PR.

  3. Merge the backport PR after approval.

  4. Deploy the backport release as per the branch’s deployment process.

---

## 🔐 Best Practices

- Always create PRs for merging into `main` or any backport branches.

- Use semantic commit messages to ensure automated release notes and tagging work properly.

- Ensure all tests and CI checks pass before merging.

---

## 📦 Summary

| Step                   | Branch Target   | Action                          |
|------------------------|-----------------|--------------------------------|
| Feature development     | `develop`       | Create feature/fix branch & PR |
| Prepare release         | `main`          | Merge from `develop`            |
| Backport fixes          | `release/x.x`   | PR from `main` or fix branch   |
| Release tagging & deploy| `main` or `release/x.x` | Automated by CI/CD          |

---

This workflow ensures stable, reliable releases with clear versioning and support for multiple maintenance lines.

---

If you want, I can also help you write example commands or GitHub Actions snippets to automate parts of this.
