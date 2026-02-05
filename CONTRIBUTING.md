# CONTRIBUTING - Development Workflow

This document defines how we collaborate on Valore.
The goal is clarity, traceability, and low friction for a small team.

---

## Branch roles

### `dev` - integration branch
- Purpose: **active development and integration**
- Rules:
  - All work branches are created from `dev`
  - All PRs target `dev`
- Expectation:
  - `dev` should remain runnable, but may change frequently

### `main` - stable reference
- Purpose: **stable reference branch**
- Rules:
  - No direct pushes
- Note:
  - Usage of `main` will be clarified later as release strategy evolves

---

## Branch naming

Branches are created from `dev`.

Use the following pattern:

```
<type>/<short-description>-#<issueId>
```

Allowed types:
- `feat`
- `fix`
- `docs`
- `refactor`
- `test`
- `chore`

Examples:
- `feat/pdf-bil-poc-#123`
- `docs/current-plan-#88`
- `fix/ingest-dedup-#77`

If there is no issue yet, omit `-#<issueId>` (issues are preferred).

---

## Commit message convention

We use **conventional commit prefixes**.

Allowed prefixes:
- `feat:` new functionality or capability (including PoCs)
- `fix:` bug fix
- `docs:` documentation only
- `test:` tests only
- `refactor:` code changes without behavior change
- `chore:` tooling, configuration, housekeeping

### Referencing issues in commits

When a commit relates to an issue, include the issue reference at the end:

```
feat: add register page (#123)
docs: update current plan (#88)
```

Commit prefixes describe the **type of change**, not the issue type.
(Issues may be tasks, but commits are still `feat`, `docs`, etc.)

---

## Pull Requests (PRs)

### Where PRs go
- Base branch: `dev`
- Compare branch: your feature branch

All work must go through a PR.

---

## How to open a PR on GitHub (web)

1. Push your branch:
   ```
   git push -u origin <your-branch>
   ```

2. Open the repository on GitHub.

3. If GitHub shows **“Compare & pull request”**, click it.
   Otherwise:
   - Go to **Pull requests**
   - Click **New pull request**

4. Select branches:
   - **Base**: `dev`
   - **Compare**: your branch

5. Set the PR title.

6. Fill the PR description using the template below.

7. Assign at least one reviewer.

8. Create the PR.

---

## PR description template (REQUIRED)

Every PR must include the following sections:

### Summary
- What does this PR change?
- Why is it needed?

### Scope
- What is included
- What is explicitly NOT included

### How to test
- Steps to verify the changes
- Commands to run (if applicable)

### Related issue
- Link the issue:
  - `Closes #123`
  - or `Related to #123`

---

## PR checklist (REQUIRED)

Before requesting review, ensure:

- [ ] Branch is up to date with `dev`
- [ ] Changes are scoped to the issue
- [ ] App runs locally (if applicable)
- [ ] Docs updated if behavior or decisions changed
- [ ] Issue reference included in PR title or description

PRs that do not meet this checklist may be sent back for fixes.

---

## General expectations

- One PR = one coherent piece of work
- Avoid mixing unrelated changes
- Prefer small PRs over large ones
- Use issues to discuss scope before coding when unclear
