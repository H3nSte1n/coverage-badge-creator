# Contributing to Transcriptase
We love your input! We want to make contributing to this project as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## We Use [Github Flow](https://guides.github.com/introduction/flow/index.html), So All Code Changes Happen Through Pull Requests
Pull requests are the best way to propose changes to the codebase. We actively welcome your pull requests:

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. Ensure the test suite passes.
4. Make sure that the linter and the formatter passes.
5. Issue that pull request!

## Local development
This project pins TypeScript to a side-by-side compiler layout:

```json
"@typescript/native": "npm:typescript@^7.0.2",
"typescript": "npm:@typescript/typescript6@^6.0.2"
```

`ts-jest` and `typescript-eslint` don't support TypeScript 7's native compiler yet. They
need the classic JS compiler API, which the `typescript` alias provides via the TS6
compatibility package. `npx tsc` still runs the real, native TypeScript 7 compiler.

**Do not** run `npm install typescript@latest` or `npm update typescript`. Either one
replaces the alias with a plain TypeScript 7 install and breaks `npm install` for everyone
else (`ts-jest`/`typescript-eslint` peer dependency conflicts). If TypeScript 7 support
lands upstream in `ts-jest` and `typescript-eslint`, this alias setup can be removed in
favor of installing `typescript` directly again.

## Any contributions you make will be under the MIT Software License
In short, when you submit code changes, your submissions will be understood under the same [MIT License](http://choosealicense.com/licenses/mit/) that covers the project. Feel free to contact the maintainers if that's a concern.

## Report bugs using Github's issues
We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/H3nSte1n/coverage-badge-creator/issues/new); it's that easy!

## License
By contributing, you agree that your contributions will be licensed under its MIT License.

## References
The document was based on the [github.gist](https://gist.github.com/briandk/3d2e8b3ec8daf5a27a62) of briandk and adapted accordingly.