import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { Globals } from './Globals';
import { SetupValidation } from './validations/SetupValidation';
import { Controller } from './Controller';
import { FormatEnum } from './enums/FormatEnum';
import { DependencyOptionsInterface } from './interfaces/DependencyOptionsInterface';

// Minimal GitHub Actions protocol helpers — avoids @actions/core dependency entirely
function getInput(name: string): string {
  return (process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] ?? '').trim();
}

function setOutput(name: string, value: string): void {
  const outputFile = process.env['GITHUB_OUTPUT'];
  if (outputFile) fs.appendFileSync(outputFile, `${name}=${value}\n`);
}

function logInfo(msg: string): void {
  process.stdout.write(msg + '\n');
}

function setFailed(msg: string): void {
  process.exitCode = 1;
  process.stderr.write(msg + '\n');
}

const FORMAT_MAP: Record<string, FormatEnum> = {
  istanbul: FormatEnum.ISTANBUL,
  jest: FormatEnum.ISTANBUL,
  lcov: FormatEnum.LCOV,
  cobertura: FormatEnum.COBERTURA,
  'coverage-py': FormatEnum.COVERAGE_PY,
};

async function run(): Promise<void> {
  try {
    const configPath = getInput('config-path');
    const coverageFilePath = getInput('coverage-file-path');
    const readmeFilePath = getInput('readme-file-path');
    const formatInput = getInput('format');
    const commit = getInput('commit') === 'true';
    const commitMessage = getInput('commit-message');

    const format = FORMAT_MAP[formatInput] ?? FormatEnum.ISTANBUL;

    if (configPath) {
      Globals.CONFIG_PATH = path.resolve(process.cwd(), configPath);
    }

    // Load config file first (sets paths and badges from .badge-config if present)
    await SetupValidation.loadConfig();

    // Action inputs take precedence over config file values
    const overrides: DependencyOptionsInterface = { format };
    if (coverageFilePath) overrides.coverage_file_path = coverageFilePath;
    if (readmeFilePath) overrides.readmeFilePath = readmeFilePath;
    Globals.init(overrides);

    await SetupValidation.scan();
    Controller.run();

    setOutput('updated', 'true');
    logInfo('\n\nBadges successfully created');

    if (commit) {
      const readmePath = Globals.BASE_README_PATH;
      execFileSync('git', ['config', '--local', 'user.name', 'github-actions[bot]']);
      execFileSync('git', ['config', '--local', 'user.email', 'github-actions[bot]@users.noreply.github.com']);
      execFileSync('git', ['add', readmePath]);
      try {
        // exits 0 if no staged changes, exits 1 if there are staged changes
        execFileSync('git', ['diff', '--cached', '--quiet']);
      } catch {
        execFileSync('git', ['commit', '-m', commitMessage]);
        execFileSync('git', ['push']);
        logInfo('README committed and pushed');
      }
    }
  } catch (error) {
    setFailed(`Coverage Badge Creator failed: ${error}`);
  }
}

run();
