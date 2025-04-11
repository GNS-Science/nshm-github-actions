# nshm-github-actions

A repo for NZSHM GitHub actions and reusable workflows.

## Python Repos

### [Python Tests Workflow](./.github/workflows/python-run-tests.yml)

Test workflow for Python repos. Runs `poetry run tox` and uploads coverage data to `Codecove`.

The repo needs to have the secret `CODECOV_TOKEN` available.

See the workflow file for available inputs.

Minimal setup:

```yml
jobs:
  call-test-workflow:
    uses: GNS-Science/nshm-github-actions/.github/workflows/python-run-tests.yml@feature/create-test-workflow
    with:
      operating-systems: "['ubuntu-latest', 'macos-latest', 'windows.latest']"
      python-versions: "['3.9', '3.10', '3.11']"
    secrets: inherit
```
