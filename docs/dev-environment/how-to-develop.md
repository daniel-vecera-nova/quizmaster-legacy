# How to develop Quizmaster

<!-- markdownlint-disable MD051 -->

- [Running Quizmaster](#🚀-running-quizmaster)
- [Running Vite dev server](#running-vite-development-server)
- [Running end-to-end tests](#🧪-running-end-to-end-tests)
- [Feature flag](#🚩-feature-flag)

## First-time setup

To install frontend dependencies, run in the `frontend` directory:

```sh
pnpm install
```

To install E2E test dependencies and Playwright browsers, run in the `specs` directory:

```sh
pnpm ci:install
```

## 🚀 Running Quizmaster

### Build the frontend

To build the front end, run the following command in the `frontend` directory:

```sh
pnpm run build
```

The front end is built to the `backend/src/main/resources/static` directory
and becomes part of the JAR assembly.

### Run the backend

To run the application, in the `backend` directory execute:

```sh
./gradlew bootRun
```

This command does not build the front end, so you need to run `pnpm run build` first.

<!-- markdownlint-disable-next-line MD045 MD033-->
## <img alt="Vite logo" src="https://vitejs.dev/logo.svg" height="20"> Running Vite Development Server

To avoid rebuilding frontend and backend every time you make a change, you can run the [Vite](https://vitejs.dev/guide/)
development server in the `frontend` directory:

```sh
pnpm dev
```

Vite starts a development server on `http://localhost:5173` and proxies requests to the backend server
on `http://localhost:8080`.

It watches for changes in the `frontend` directory and reloads the browser automatically with HMR.

## 🧪 Running end-to-end tests

You can run the end-to-end [Cucumber](https://cucumber.io/docs/guides/) + [Playwright](https://playwright.dev/) tests from the `specs` directory.

Do not forget to install latest browsers with command:

```sh
cd specs
pnpm playwright install --with-deps
```

Run one of the following commands from the `specs` directory:

- `pnpm run test:e2e` against the running app on `http://localhost:8080` (requires building the frontend first)
- `pnpm run test:e2e:vite` against the running app on `http://localhost:5173`
- `pnpm run test:e2e:ui` with Playwright UI (at `http://localhost:3333`) against the Vite development server on `http://localhost:5173`

## Swagger UI ###
For easier testing, Swagger UI is available at http://localhost:8080/swagger-ui/index.html

## 🚩 Feature Flag

Hide an unfinished feature behind a feature flag. It will be hidden in production builds,
but runs in end-to-end tests in GitHub Actions CI/CD build.

- on the frontend, the feature flag is a global constant `FEATURE_FLAG_ENABLED`

    ```typescript
    if (FEATURE_FLAG_ENABLED) {
        // Unfinished feature
    }
    ```

- on the backend, the feature flag is a static method `FeatureFlag.isEnabled()`

    ```java
    import cz.scrumdojo.quizmaster.FeatureFlag;

    if (FeatureFlag.isEnabled()) {
        // Unfinished feature
    }
    ```

- in specifications, mark scenario with @feature-flag that pass only when feature flag is enabled

    ```gherkin
    @feature-flag
    Scenario: Unfinished scenario
        # Passes only when feature flag is set
    ```
- in specifications, mark scenario with flag @not-feature-flag that pass only when feature flag is disabled

    ```gherkin
    @not-feature-flag
    Scenario: Former scenario
        # Passes only when feature flag is not set (i.e. is false)
    ```

### Enable Feature Flag

To enable the feature flag, set the `FEATURE_FLAG` environment variable to `true`.

- Enable feature flag on the backend:

    ```bash
    cd backend
    export FEATURE_FLAG=true
    ./gradlew build
    ./gradlew bootrun
    ```

- Enable feature flag on the frontend:

    ```bash
    cd frontend
    export FEATURE_FLAG=true
    pnpm dev
    ```

- Run end-to-end tests with feature flag enabled

    ```bash
    cd specs
    export FEATURE_FLAG=true
    pnpm test:e2e:vite
    ```

Note: on Windows set the feature flag with `$env:FEATURE_FLAG="true"` command.
