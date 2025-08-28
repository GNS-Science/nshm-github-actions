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

### [Python Release Workflow](./.github/workflows/python-release.yml)

Creates a GitHub release and publishes the package to PyPI. Would commonly be one of two jobs along with with Python Deploy Docs in a repo workflow triggered by e.g. tagging a version.

Requires the secret `PYPI_API_TOKEN`.

Example use:

```yml
jobs:
  release-and-distribute:
    uses:  GNS-Science/nshm-github-actions/.github/workflows/python-release.yml@main
    with:
      python-version:  '3.12'
    secrets: inherit
```


### [Python Deploy Docs Workflow](./.github/workflows/python-deploy-docs.yml)

Publishes documentation for a python package to GitHub pages. Uses `mkdocs` for building documentation. Would commonly be one of two jobs along with with Python Release Workflow in a repo workflow triggered by e.g. tagging a version.

Requires that the branch or tag you want to use has permission to do so in the `github-pages` environment; see [GitHub documentation](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments).

Example use:

```yml
jobs:
  deploy-docs:
    uses:  GNS-Science/nshm-github-actions/.github/workflows/python-deploy-docs.yml@main
    with:
      python-version:  '3.12'
    secrets: inherit
```