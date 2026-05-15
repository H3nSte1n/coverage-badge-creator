<h1>Coverage Badge Creator</h1>
<br>

![Coverage](https://img.shields.io/badge/Coverage-98%25-83A603.svg?prefix=$coverage$) [![CI](https://github.com/H3nSte1n/coverage-badge-creator/workflows/CI/badge.svg?style=flat)](https://github.com/H3nSte1n/coverage-badge-creator/actions/workflows/CI.yml) [![Build](https://github.com/H3nSte1n/coverage-badge-creator/workflows/Build/badge.svg?style=flat)](https://github.com/H3nSte1n/coverage-badge-creator/actions/workflows/Build.yml) [![Code Style](https://github.com/H3nSte1n/coverage-badge-creator/workflows/Code-Style/badge.svg?style=flat)](https://github.com/H3nSte1n/coverage-badge-creator/actions/workflows/Code-Style.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat)](https://github.com/H3nSte1n/coverage-badge-creator/blob/master/LICENSE) [![Release](https://img.shields.io/github/release/H3nSte1n/coverage-badge-creator.svg?style=flat)](https://GitHub.com/H3nSte1n/coverage-badge-creator/releases/) ![Maintained](https://img.shields.io/badge/Maintained%3F-yes-green.svg?style=flat)
<br><br>

Coverage Badge Creator reads your test coverage report and inserts live badges into your README — for any language, via GitHub Action or npm.

**[→ Interactive docs site](https://h3nste1n.github.io/coverage-badge-creator/)**

<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#quick-start">Quick Start</a></li>
    <li>
      <a href="#usage">Usage</a>
      <ul>
        <li><a href="#step-1-produce-a-coverage-report">Step 1: Produce a coverage report</a></li>
        <li><a href="#step-2-add-placeholders-to-your-readme">Step 2: Add placeholders to your README</a></li>
        <li><a href="#step-3a-run-via-github-action">Step 3a: Run via GitHub Action</a></li>
        <li><a href="#step-3b-run-via-npm-script-js-projects">Step 3b: Run via npm script</a></li>
      </ul>
    </li>
    <li>
      <a href="#config">Config</a>
      <ul>
        <li><a href="#coverage-report-format">Coverage report format</a></li>
        <li><a href="#coverage-file-path">Coverage file path</a></li>
        <li><a href="#badges">Badges</a></li>
        <li><a href="#extended">Extended</a></li>
      </ul>
    </li>
    <li><a href="#requirements">Requirements</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>


## Quick Start

**Via GitHub Action** — works for any language, no Node.js required:

```yaml
# .github/workflows/coverage.yml
name: Coverage badges
on: [push]
jobs:
  badges:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
      - run: <your test command here>   # produces a coverage report
      - uses: H3nSte1n/coverage-badge-creator@v2
        with:
          format: istanbul   # istanbul · lcov · cobertura · coverage-py
          commit: true       # auto-commit the updated README
```

**Via npm** — for JavaScript projects that want a local script:

```sh
npm install --save-dev coverage-badge-creator
```
```json
"scripts": {
  "coverage:badge": "coverage-badge-creator"
}
```
```sh
npm test && npm run coverage:badge
```


## Usage

### Step 1: Produce a coverage report

Generate a coverage file in one of the supported formats:

**JavaScript / TypeScript (Jest)**
```js
// jest.config.js — add 'json-summary' to coverageReporters
module.exports = {
  coverageReporters: ['json-summary', 'text'],
};
// output: coverage/coverage-summary.json  →  format: istanbul
```

**JavaScript / TypeScript (Mocha + NYC)**
```sh
nyc --reporter=json-summary mocha
# output: coverage/coverage-summary.json  →  format: istanbul
```

**Python**
```sh
# JSON (recommended)
coverage run -m pytest && coverage json
# output: coverage.json  →  format: coverage-py

# XML / Cobertura
coverage run -m pytest && coverage xml
# output: coverage.xml  →  format: cobertura
```

**Go**
```sh
go test -coverprofile=coverage.out ./...
gcov2lcov -infile coverage.out -outfile coverage.info
# output: coverage.info  →  format: lcov
```

**Java (JaCoCo)**
```sh
./gradlew test jacocoTestReport
# output: build/reports/cobertura.xml  →  format: cobertura
```

**Ruby**
```sh
# SimpleCov with lcov formatter
bundle exec rspec
# output: coverage/lcov/project.lcov  →  format: lcov
```

---

### Step 2: Add placeholders to your README

Insert any of these tokens anywhere in your README. After the tool runs, each token is replaced with a live badge image:

```md
<!-- Before -->
$coverage$   $statements$   $branches$   $functions$   $lines$

<!-- After (the tool replaces each token with a badge URL) -->
![](https://img.shields.io/badge/Coverage-98%25-83A603.svg?prefix=$coverage$)
```

_The surrounding dollar signs are required._

---

### Step 3a: Run via GitHub Action

Add a step after your test run. The action commits the updated README automatically when `commit: true`.

**Python example**
```yaml
- run: coverage run -m pytest && coverage json
- uses: H3nSte1n/coverage-badge-creator@v2
  with:
    format: coverage-py
    coverage-file-path: ./coverage.json
    commit: true
```

**Go example**
```yaml
- run: go test -coverprofile=coverage.out ./... && gcov2lcov -infile coverage.out -outfile coverage.info
- uses: H3nSte1n/coverage-badge-creator@v2
  with:
    format: lcov
    coverage-file-path: ./coverage.info
    commit: true
```

**Java (JaCoCo) example**
```yaml
- run: ./gradlew test jacocoTestReport
- uses: H3nSte1n/coverage-badge-creator@v2
  with:
    format: cobertura
    coverage-file-path: ./build/reports/cobertura.xml
    commit: true
```

**JavaScript / TypeScript example**
```yaml
- run: npm test
- uses: H3nSte1n/coverage-badge-creator@v2
  with:
    format: istanbul
    commit: true
```

> [!NOTE]
> The workflow needs `permissions: contents: write` (or a PAT) when `commit: true` is set.

**Action inputs**

| Input | Description | Default |
|---|---|---|
| `format` | Coverage report format | `istanbul` |
| `coverage-file-path` | Path to the coverage report | *(from `.badge-config`)* |
| `readme-file-path` | Path to the README to update | `./README.md` |
| `config-path` | Path to a `.badge-config` file | `./.badge-config` |
| `commit` | Auto-commit the updated README | `false` |
| `commit-message` | Commit message when `commit` is true | `chore: update coverage badges [skip ci]` |

---

### Step 3b: Run via npm script (JS projects)

Add the command to your `package.json` and run it after your test step:

```json
"scripts": {
  "coverage:badge": "coverage-badge-creator"
}
```
```sh
npm run coverage:badge
```

Install:
```sh
npm install --save-dev coverage-badge-creator
# or
yarn add --dev coverage-badge-creator
```


## Config

Create a `.badge-config` file in your project root to customise the tool's behaviour.

_For a full example see [.conversion-badge-config](https://github.com/H3nSte1n/coverage-badge-creator/blob/main/.conversion-badge-config)._

### coverage report format
```json
{
  "format": "lcov"
}
```

| Value | Coverage tool | Typical output file |
|---|---|---|
| `istanbul` / `jest` (default) | Jest, NYC, Istanbul | `coverage/coverage-summary.json` |
| `lcov` | Go, C/C++, Ruby, Python (with lcov reporter) | `coverage/lcov.info` |
| `cobertura` | Java (JaCoCo), Python (`coverage xml`), .NET | `coverage.xml` |
| `coverage-py` | Python (`coverage json`) | `coverage.json` |

### coverage file path
```json
{
  "coverage_file_path": "./coverage/json-summary.json"
}
```

### badges
```json
{
  "badges": {
    "coverage": {
      "style": "for-the-badge",
      "logo": "github",
      "color": "blue"
    }
  }
}
```
**Available badge keys:** `coverage` · `statements` · `branches` · `functions` · `lines`

**Options**
 * `style` — `flat` · `flat-square` · `plastic` · `for-the-badge` · `social`
 * `logo` — any [shields.io logo slug](https://simpleicons.org/) (e.g. `jest`, `github`, `kotlin`)
 * `logoColor` — color of the logo icon
 * `color` — hex without `#`, or a [shields.io named color](https://shields.io/)
 * `link` — URL the badge points at

 _For all options → ![](https://img.shields.io/badge/Shields.io-informational?style=for-the-badge&logo=Shields.io&logoColor=white&color=black&link=https://shields.io/)_

### Extended
**CLI options**

* --config
  > Change the path and name of the configuration file.

  ```sh
  "scripts": {
    "coverage:badge": "coverage-badge-creator --config './badge-coverage-config.json'"
  }
  ```


## Requirements

* **GitHub Action** — no local requirements; Node.js is provided by GitHub.
* **npm / yarn** — Node.js ≥ 20


## Contributing
Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/new_feature`)
3. Commit your Changes (`git commit -m 'feat: Add new feature'`)
4. Push to the Branch (`git push origin feature/new_feature`)
5. Open a Pull Request


## License
Distributed under the MIT License. See `LICENSE` for more information.


## Contact
This npm package is primarily the work of [Henry Steinhauer (H3nSte1n)](https://github.com/H3nSte1n), for full list of contributors see the [contributors graph](https://github.com/H3nSte1n/coverage-badge-creator/graphs/contributors).


## Acknowledgements
* [Img Shields](https://shields.io)
* [README Template](https://github.com/othneildrew/Best-README-Template/blob/master/README.md)




<!--infos-->
[issues-shield]: https://img.shields.io/github/issues/H3nSte1n/coverage-badge-creator.svg?style=flat
[issues-url]: https://github.com/H3nSte1n/coverage-badge-creator/issues
