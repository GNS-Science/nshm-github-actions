# nshm-github-actions

A repo for NZSHM GitHub actions and reusable workflows.

## Python Repos

Workflows for Python projects using [uv](https://docs.astral.sh/uv/).

### [Python Tests Workflow (uv)](./.github/workflows/python-run-tests-uv.yml)

Runs `uv run tox` and uploads coverage data to Codecov.

Minimal setup:

```yml
jobs:
  call-test-workflow:
    uses: GNS-Science/nshm-github-actions/.github/workflows/python-run-tests-uv.yml@main
    with:
      operating-systems: "['ubuntu-latest', 'macos-latest', 'windows-latest']"
      python-versions: "['3.12', '3.13', '3.14']"
    secrets: inherit
```

### [Python Release Workflow (uv)](./.github/workflows/python-release-uv.yml)

Creates a GitHub release and publishes the package to PyPI using `uv build`. Requires the secret `PYPI_API_TOKEN`.

When triggered by a version tag, the workflow verifies that `CHANGELOG.md` contains a `## [VERSION]` section matching the tag before proceeding. It fails fast (before installing dependencies) if the entry is missing.

```yml
jobs:
  release-and-distribute:
    uses: GNS-Science/nshm-github-actions/.github/workflows/python-release-uv.yml@main
    with:
      python-version: "3.12"
      # tag-prefix: "v"          # default: v
      # changelog-path: "CHANGELOG.md"  # default: CHANGELOG.md
    secrets: inherit
```

### [Python Deploy Docs Workflow (uv)](./.github/workflows/python-deploy-docs-uv.yml)

Publishes mkdocs documentation to GitHub Pages using uv.

```yml
jobs:
  deploy-docs:
    uses: GNS-Science/nshm-github-actions/.github/workflows/python-deploy-docs-uv.yml@main
    with:
      python-version: "3.12"
    secrets: inherit
```

## API Deployment

[deploy-to-aws-uv.yml](./.github/workflows/deploy-to-aws-uv.yml) deploys Python and JS APIs to AWS.

Example use:

```yaml
  call-deploy-workflow:
    needs: call-test-workflow
    uses: GNS-Science/nshm-github-actions/.github/workflows/deploy-to-aws-uv.yml@main
    with:
      python-version: "3.12"
    secrets: inherit
```

See [deploy-to-aws-uv.yml](./.github/workflows/deploy-to-aws-uv.yml) for a list of supported and required list of secrets and environment variables as well as workflow inputs.

## Pre-push changelog hook

A local git hook is available at [`hooks/pre-push-changelog`](./hooks/pre-push-changelog). It performs the same changelog-entry check as the release workflows, blocking a version tag push before it reaches CI.

### Install

Run once per repository checkout. On Windows, use Git Bash (not PowerShell or cmd).

```bash
mkdir -p .githooks
curl -o .githooks/pre-push \
  https://raw.githubusercontent.com/GNS-Science/nshm-github-actions/main/hooks/pre-push-changelog
chmod +x .githooks/pre-push
git config core.hooksPath .githooks
```

The hook can be bypassed with `git push --no-verify`, but CI will still enforce the check.

### Configuration

Override defaults via environment variables (e.g. via `direnv` or your shell profile):

| Variable | Default | Description |
|---|---|---|
| `TAG_PREFIX` | `v` | Prefix stripped from the tag name to derive the version |
| `CHANGELOG_PATH` | `CHANGELOG.md` | Path to the changelog file (relative to repo root) |
