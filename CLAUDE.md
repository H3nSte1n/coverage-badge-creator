# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Build (compiles TypeScript to lib/)
npm run build

# Run tests with coverage
npm test

# Run tests in watch mode
npm run test:dev

# Run a single test file
npx jest tests/workers/BadgeWorker.spec.ts --config jestconfig.json

# Lint
npm run lint

# Format source files
npm run format

# Run the tool against this repo's own coverage
npm run coverage:badge
```

## Architecture

This is a CLI tool that reads a Jest/Istanbul coverage JSON report and inserts shield.io badge URLs into a README.

**Execution flow** (`src/index.ts` → `Controller.run()`):
1. `SetupValidation.loadConfig()` — reads CLI argv (`--config <path>`) to locate an optional JSON config file, then calls `Globals.init()` to override defaults.
2. `SetupValidation.scan()` — verifies the coverage file and README exist.
3. `Coverage.init().validate()` — parses `coverage/coverage-summary.json`, computes per-category stats (`statements`, `branches`, `functions`, `lines`) plus an overall `coverage` median, and maps each percentage to a color via `ColorValidation`.
4. `Readme.prepareData(...).insertCov()` — for each category, `Badge.create()` builds a shields.io URL, then `ReadmeWorker` regex-replaces placeholder tokens (`$statements$`, `$coverage$`, etc.) or existing badge URLs in the README.

**Key globals** (`src/Globals.ts`): All runtime paths and configuration are static properties on `Globals`. `Globals.init()` resolves relative paths against `process.cwd()`.

**Config file** (`.badge-config` by default, overridden via `--config`): JSON matching `DependencyOptionsInterface` — can set `coverage_file_path`, `readmeFilePath`, and per-category `badges` options (shields.io query params like `style`, `logo`, `color`).

**Build output**: TypeScript sources in `src/` compile to `lib/` (`.js` + `.d.ts`). The `lib/` directory is what gets published to npm. Never edit `lib/` directly.

**Tests**: `tests/` mirrors `src/` structure. Uses `ts-jest` with config in `jestconfig.json`. Test data lives in `tests/data/`.
