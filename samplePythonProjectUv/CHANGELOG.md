# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

- deps: major (transitive): python-dateutil 3→4, watchdog 6→7; minor (2 pkgs: cachetools, python-discovery); patch (9 pkgs: filelock, markdown, platformdirs, pyproject-api, tox, tox-uv, tox-uv-bare, uv, virtualenv)
- deps: major (transitive): python-dateutil 2→3, filelock 3→4 (with tox 4.67.4, virtualenv 21.15.1, python-discovery 1.6.7; fixes filelock/virtualenv advisories on py≥3.11)
- deps: minor (13 pkgs: cachetools, click, markdown, platformdirs, pluggy, pygments, pyproject-api, pytest, tox-uv, tox-uv-bare, typing-extensions, uv, packaging; fixes uv GHSA-4gg8-gxpx-9rph, PYSEC-2026-4321)
- deps: patch (4 pkgs: iniconfig, markupsafe, distlib, virtualenv)
- deps: patch (4 pkgs: tox-uv, tox-uv-bare, click, uv), minor (7 pkgs: tox, cachetools, filelock, packaging, pathspec, python-discovery, virtualenv), major: pytest 8→9 (fixes GHSA-6w46-j5rx-g56g)

## [0.1.0] - 2024-01-01

### Added
- Initial release fixture for nshm-github-actions workflow testing.
