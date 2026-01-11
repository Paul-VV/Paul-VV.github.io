# Repository Guidelines

## Project Structure & Module Organization
- `main.ts` holds the core module and the executable entry point (guarded by `import.meta.main`).
- `main_test.ts` contains unit tests for exported functions.
- `deno.json` defines Deno tasks and import mappings.
- `Website` is an empty placeholder file today; remove it if unused or document its purpose before adding content.

## Build, Test, and Development Commands
- `deno task dev`: runs `main.ts` in watch mode for local development.
- `deno task test`: executes the test suite (add more test files as the project grows).
- `deno task lint`: runs the Deno linter over source and tests.
- `deno task fmt`: formats source and tests in place.

## Coding Style & Naming Conventions
- Use TypeScript with 2-space indentation (match existing formatting).
- Keep exported functions in `main.ts` and import them in tests via relative paths (e.g., `./main.ts`).
- Name test functions descriptively using Deno’s `Deno.test` API (e.g., `addTest`).
- If formatting becomes inconsistent, standardize with `deno task fmt` across source and tests.

## Testing Guidelines
- Tests use Deno’s built-in test runner and the `@std/assert` library via `deno task test`.
- Prefer small, focused unit tests per exported function.
- Name test files with the `_test.ts` suffix so `deno test` discovers them automatically.

## Commit & Pull Request Guidelines
- Git history currently shows a single commit (“first commit”), so no strict convention is established.
- Use short, imperative commit subjects (e.g., “Add subtraction helper”).
- PRs should include: a brief summary, any relevant test command output, and screenshots only if you add UI in the future.

## Configuration Tips
- Update `deno.json` when adding new tasks or import mappings.
- Keep dependencies pinned via `jsr:` or `npm:` specifiers to avoid drift.
