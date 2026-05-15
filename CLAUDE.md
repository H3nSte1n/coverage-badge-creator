# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Build npm package (compiles TypeScript to lib/)
npm run build

# Build GitHub Action bundle (bundles src/action-entry.ts → dist/index.js via ncc)
npm run build:action

# Build both targets
npm run build:all

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

This tool reads a coverage report and inserts shields.io badge URLs into a README. It ships as both an npm package and a GitHub Action.

**Execution flow** (`src/index.ts` → `Controller.run()`):
1. `SetupValidation.loadConfig()` — reads CLI argv (`--config <path>`) to locate an optional JSON config file, then calls `Globals.init()` to override defaults.
2. `SetupValidation.scan()` — verifies the coverage file and README exist.
3. `Coverage.init().validate()` — delegates to `ParserFactory.getParser(Globals.FORMAT)` to parse the coverage report (Istanbul JSON, lcov, Cobertura XML, or coverage.py JSON), computes per-category stats (`statements`, `branches`, `functions`, `lines`) plus an overall `coverage` median, and maps each percentage to a color via `ColorValidation`.
4. `Readme.prepareData(...).insertCov()` — for each category, `Badge.create()` builds a shields.io URL, then `ReadmeWorker` regex-replaces placeholder tokens (`$statements$`, `$coverage$`, etc.) or existing badge URLs in the README.

**Parser abstraction** (`src/parsers/`): `ParserFactory.getParser(format)` returns a `CoverageParser` instance for `istanbul` (default), `lcov`, `cobertura`, or `coverage-py`. All parsers implement `parse(fileContent): CoverageInterface` and normalize to the same `{ total: { statements, branches, functions, lines } }` shape.

**Key globals** (`src/Globals.ts`): All runtime paths and configuration are static properties on `Globals`. `Globals.init()` resolves relative paths against `process.cwd()`. The `FORMAT` field controls which parser is used.

**Config file** (`.badge-config` by default, overridden via `--config`): JSON matching `DependencyOptionsInterface` — can set `format`, `coverage_file_path`, `readmeFilePath`, and per-category `badges` options (shields.io query params like `style`, `logo`, `color`).

**npm build output**: TypeScript sources in `src/` compile to `lib/` (`.js` + `.d.ts`). The `lib/` directory is what gets published to npm. Never edit `lib/` directly.

**GitHub Action build output**: `src/action-entry.ts` is bundled by `@vercel/ncc` into `dist/index.js` (zero runtime deps, ~22kB). `dist/index.js` must be committed — GitHub reads it directly. Run `npm run build:action` after changing `action-entry.ts` or any file it imports.

**Tests**: `tests/` mirrors `src/` structure. Uses `ts-jest` with config in `jestconfig.json`. Test data (including lcov, Cobertura XML, and coverage.py fixtures) lives in `tests/data/`.
