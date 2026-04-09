# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository purpose

Central home for GNS-Science NSHM **reusable GitHub Actions workflows** and composite actions, consumed by downstream NSHM repos via `uses: GNS-Science/nshm-github-actions/.github/workflows/<file>.yml@<ref>`. This repo is not an application — changes here ship by being referenced from other repos' workflows.

## Layout

- `.github/workflows/` — reusable workflows (callable via `workflow_call`):
  - `python-run-tests.yml` — runs `poetry run tox`, uploads to Codecov (needs `CODECOV_TOKEN`).
  - `python-release.yml` — GitHub release + PyPI publish (needs `PYPI_API_TOKEN`).
  - `python-deploy-docs.yml` — mkdocs build + deploy to GitHub Pages (`github-pages` env must permit the ref).
  - `deploy-to-aws.yml` — deploys Python/JS APIs to AWS; see file header for full input/secret matrix.
  - `*-test.yml` — self-test workflows that invoke the reusable workflows against `samplePythonProject/` on push/PR to verify changes before consumers pick them up.
- `.github/actions/` — composite actions reused by the workflows:
  - `python-install/` — standardized Python + Poetry setup.
  - `apiSmokeTest/` — post-deploy smoke test for deployed APIs.
- `samplePythonProject/` — minimal Poetry + tox project used exclusively as a fixture for the `*-test.yml` workflows. Not a published package.

## Working on workflows

- When editing a reusable workflow, also check/update its `*-test.yml` counterpart and run it (push to a branch) to validate end-to-end before merging — downstream repos pin to refs here, so breakage is remote.
- Downstream examples in `README.MD` pin to `@main` or feature branches; breaking input/secret changes need a coordinated bump.
- Secrets/inputs for `deploy-to-aws.yml` are documented inline in the workflow file — treat it as the source of truth over README.

## samplePythonProject

Uses Poetry + tox. To reproduce the test-workflow locally: `cd samplePythonProject && poetry install && poetry run tox`. Only touch it when the fixture needs to exercise a new workflow feature.
