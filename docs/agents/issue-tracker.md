# Issue Tracker: GitHub — GaliGuide

Issues and specifications for this repository live as GitHub issues on `saransh-sh/galiguide`. Use the `gh` CLI for all operations.

## Conventions

- **Create an issue:** `gh issue create --title "..." --body "..."`
- **Read an issue:** `gh issue view <number> --comments`
- **List issues:** `gh issue list --state open --json number,title,body,labels,comments`
- **Comment on an issue:** `gh issue comment <number> --body "..."`
- **Apply / remove labels:** `gh issue edit <number> --add-label "..."` / `--remove-label "..."`
- **Close an issue:** `gh issue close <number> --comment "..."`

Infer the repo from `git remote -v` — `gh` does this automatically within the workspace clone.

## Pull Requests as a Triage Surface

When contributing PRs:
- **Read a PR:** `gh pr view <number> --comments` and `gh pr diff <number>`
- **Test Gate:** All GitHub Actions workflows (`.github/workflows/ci.yml`) must pass before merging.
- **Vercel Automatic Deploy:** Merges to `main` automatically trigger production deployments on Vercel.
