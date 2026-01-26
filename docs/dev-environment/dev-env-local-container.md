# Run in a local Docker/Podman container

- [Prerequisites](#prerequisites)
- [Create a Dev Environment Container](#create-a-dev-environment-container)

## Prerequisites

0. On Windows, make sure you have [WSL2 installed](https://learn.microsoft.com/en-us/windows/wsl/install):

    ```sh
    wsl --install
    ```

1. Install either Docker (Mac/Win) or Podman (Win) on your machine.
2. Optionally install Podman Desktop if you prefer a GUI.
3. On Windows, reboot after installation.
4. If you use Podman, create and start a Podman machine:

    ```sh
    podman machine init
    podman machine start
    ```

## Create a Dev Environment Container

### Using VS Code / Cursor / Windsurf

Prefer opening the repository directly in a dev container using your IDE via "Dev Containers: Reopen in Container" choosing the right CPU architecture for your OS/Machine. This sets up Java 21, Node 22 + pnpm, PostgreSQL 16, and Playwright automatically in a single container.

### Others

To create the development environment container, run one of the following:

```sh
# Podman
podman run -it -d -p 2222:22 -p 8080:8080 -p 5432:5432 -p 5173:5173 -p 3333:3333 --name quizmaster-dev ghcr.io/scrumdojo/quizmaster-java-devenv:v1

# Docker
docker run -it -d \
  -p 2222:22 -p 8080:8080 -p 5432:5432 -p 5173:5173 -p 3333:3333 \
  --name quizmaster-dev \
  ghcr.io/scrumdojo/quizmaster-java-devenv:v1
```

The container runs in the background, so that you can connect to it from your favorite IDE.

To stop the container, run on your host OS:

```sh
podman stop quizmaster-dev
# or
docker stop quizmaster-dev
```

To restart the container, run on your host OS:

```sh
podman start quizmaster-dev
# or
docker start quizmaster-dev
```
