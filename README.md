<h1>Coverage Badge Creator</h1>  
<br>

![](https://img.shields.io/badge/Coverage-98%25-83A603.svg?prefix=$coverage$)
![CI][ci]
![Build][build]
![Code-Style][code-style]

[![MIT License][license-shield]][license-url]
[![Release][release-shield]][release-url]
![Maintenance][maintained-shield]
<br><br>

Coverage Badge Creator reads your test coverage report and inserts live badges into your README — for any language, via GitHub Action or npm.

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
    <li><a href="#npm--yarn-installation">npm / yarn Installation</a></li>
    <li><a href="#requirements">Requirements</a></li>
    <li><a href="#built-with">Built With</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>


## Quick Start

**Via GitHub Action** — works for any language, no Node.js required:
```yaml
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


## Usage

### Step 1: Produce a coverage report

Generate a coverage file in one of the supported formats:

**JavaScript / TypeScript (Jest)**
```sh
# jest.config.js: add 'json-summary' to coverageReporters
# output: coverage/coverage-summary.json  →  format: istanbul
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
# JaCoCo generates Cobertura XML via the cobertura report task
# output: build/reports/cobertura.xml  →  format: cobertura
```

**Ruby**
```sh
# SimpleCov with lcov formatter
# output: coverage/lcov/project.lcov  →  format: lcov
```

---

### Step 2: Add placeholders to your README

Insert any of these keys anywhere in your README. They will be replaced with live badge images:

 * $coverage$
 * ![](https://img.shields.io/badge/Coverage-90%25-.svg?prefix=$statements$)
 * ![](https://img.shields.io/badge/Coverage-90%25-.svg?prefix=$branches$)
 * ![](https://img.shields.io/badge/Coverage-90%25-.svg?prefix=$functions$)
 * $lines$

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
| `istanbul` (default) | Jest, NYC, Istanbul | `coverage/coverage-summary.json` |
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
      "logo": "github",
      "color": "blue"
    }
  }
}
```
**Available badge keys:** `coverage` · `statements` · `branches` · `functions` · `lines`

**Options**
 * style  
 ![plastic][style-plastic] ![flat][style-flat] ![flat-square][style-flat-square] ![flat-for-the-badge][style-for-the-badge] ![social][style-social]
 * logo  
  ![kotlin][logo-kotlin] ![medium][logo-medium] ![github][logo-github]
 * logoColor  
 ![blue][logo-blue] ![green][logo-green] ![white][logo-black]
 * color  
  ![blue][color-blue] ![green][color-green] ![white][color-black]
 * link  
  ![blue][link-github] ![green][link-medium] ![white][link-reddit]
 
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


## npm / yarn Installation

> If you're using the GitHub Action, no local installation is needed.

[`npm`](https://www.npmjs.com/package/coverage-badge-creator):
```sh
npm install --save-dev coverage-badge-creator
```
[`yarn`](https://yarnpkg.com/en/package/coverage-badge-creator):
```sh
yarn add --dev coverage-badge-creator
```


## Requirements

* **GitHub Action** — no local requirements; Node.js is provided by GitHub.
* **npm / yarn** — Node.js > v10.0.0


## Built With
* [Node](https://nodejs.org/en/)
* [Typescript](https://www.typescriptlang.org/)
* [Jest](https://jestjs.io/)


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




<!--shield-styles-->
[style-plastic]: https://img.shields.io/badge/plastic-83A603.svg?style=plastic
[style-flat]: https://img.shields.io/badge/flat-83A603.svg?style=flat
[style-flat-square]: https://img.shields.io/badge/flat_square-83A603.svg?style=flat-square
[style-for-the-badge]: https://img.shields.io/badge/for_the_badge-83A603.svg?style=for-the-badge
[style-social]: https://img.shields.io/badge/social-83A603.svg?style=social

[logo-github]: https://img.shields.io/badge/logo-github.svg?logo=github
[logo-kotlin]: https://img.shields.io/badge/logo-kotlin.svg?logo=kotlin
[logo-medium]: https://img.shields.io/badge/logo-medium.svg?logo=medium

[logo-blue]: https://img.shields.io/badge/blue-83A603.svg?logo=github&logoColor=blue
[logo-green]: https://img.shields.io/badge/green-83A603.svg?logo=kotlin&logoColor=green
[logo-black]: https://img.shields.io/badge/black-83A603.svg?logo=medium&logoColor=black

[color-blue]: https://img.shields.io/badge/blue-83A603.svg?color=blue
[color-green]: https://img.shields.io/badge/green-83A603.svg?green=green
[color-black]: https://img.shields.io/badge/black-83A603.svg?color=black

[link-github]: https://img.shields.io/badge/Github-83A603.svg?link=https://github.com/
[link-medium]: https://img.shields.io/badge/Medium-83A603.svg?link=https://medium.com/
[link-reddit]: https://img.shields.io/badge/Reddit-83A603.svg?link=https://www.reddit.com/

<!--infos-->
[ci]: https://github.com/H3nSte1n/coverage-badge-creator/workflows/CI/badge.svg?style=flat
[build]: https://github.com/H3nSte1n/coverage-badge-creator/workflows/Build/badge.svg?style=flat
[code-style]: https://github.com/H3nSte1n/coverage-badge-creator/workflows/Code-Style/badge.svg?style=flat
[maintained-shield]: https://img.shields.io/badge/Maintained%3F-yes-green.svg?style=flat
[release-shield]: https://img.shields.io/github/release/H3nSte1n/coverage-badge-creator.svg?style=flat
[release-url]: https://GitHub.com/H3nSte1n/coverage-badge-creator/releases/
[issues-shield]: https://img.shields.io/github/issues/H3nSte1n/coverage-badge-creator.svg?style=flat
[issues-url]: https://github.com/H3nSte1n/coverage-badge-creator/issues
[license-shield]: https://img.shields.io/badge/License-MIT-yellow.svg?style=flat
[license-url]: https://github.com/H3nSte1n/coverage-badge-creator/blob/master/LICENSE
