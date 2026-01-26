# Setup IntelliJ IDEA

<!-- markdownlint-disable MD033 -->

This setup assumes IntelliJ IDEA Ultimate edition.

## Plugins

Make sure to install the following plugins.

- [Cucumber.js](https://plugins.jetbrains.com/plugin/7418-cucumber-js) for writing and running Cucumber tests
- [Biome](https://plugins.jetbrains.com/plugin/22761-biome) for linting and auto-formatting TypeScript code \
    ⚠️ Version 1.5.0 or higher. If you see lower version, update your IntelliJ first.

If you develop in a remote environment (GitHub Codespaces or local Docker/Podman container), install the plugins to host, not client.

## Setup Node.js

Setup Node.js and pnpm in **Settings > Languages & Frameworks > Node.js**:

| OS      | Settings                                                                                                               |
|---------|------------------------------------------------------------------------------------------------------------------------|
| Windows | Node interpreter: `<project dir>\frontend\node\node.exe` <br/> Package manager: `<project dir>\frontend\node\pnpm.cmd` |
| Linux   | Node interpreter: `<project dir>/frontend/node/bin/node` <br/> Package manager: `<project dir>/frontend/node/bin/pnpm` |

## Running Cucumber tests from IDE

When creating a Run configuration for running Cucumber tests directly in your IDE,
make sure you set the working directory to `specs`.
