# 🖥️ Development Environment

You have multiple options to prepare your development environment:

1. [GitHub Codespaces](dev-env-codespaces.md) (recommended)\
Prepared and self-contained dev environment in a GitHub Codespaces instance.

    - The most convenient, works out-of-box. All you need is a browser or VS Code.
    - To connect from Cursor or IntelliJ IDEA requires setting up SSH access.

2. [Local Docker/Podman container](dev-env-local-container.md) \
Prepared and self-contained dev environment in a local Docker/Podman container.

    - Requires local Docker/Podman installation (plus WSL2 on Windows).
    - Requires auth to GitHub from within the container.
    - People with macOS reported issues when working in IntelliJ.
    - VS Code, Cursor, Windsurf: Prefer opening the repo directly via VS Code/Cursor/Windsurf → "Dev Containers: Reopen in Container" choosing the right CPU architecture for your OS/Machine.

3. [Local environment](dev-env-local.md) \
Run everything locally, like in the good ol' days. You need Java 21 JDK, Node.js, pnpm and PostgreSQL 16,
the rest (Gradle and Playwright) gets downloaded automatically.

    - Requires local admin / sudo to install JDK 21, Node.js, pnpm and PostgreSQL 16.
    - You have to figure out all the quirks on your own. The local dev environment is as self-contained as possible, but your local configuration can still diverge in multitude of ways.
