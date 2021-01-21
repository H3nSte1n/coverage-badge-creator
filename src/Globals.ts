import { DependencyOptionsInterface } from './interfaces/DependencyOptionsInterface';
import { ArgvOptionsEnum } from './enums/ArgvOptionsEnum';

export class Globals {
  private static instance: Globals;
  static CONFIG_PATH = './.badge-config';
  static DEFAULT_COV_PATH = './coverage/coverage-summary.json';
  static COVERAGE_CATEGORIES = ['statements', 'branches', 'functions', 'lines'];
  static BADGE_BASE_URL = '![](https://img.shields.io/badge/';
  static BADGE_BASE_URL_PATTERN = '\\!\\[]\\(https:\\/\\/img\\.shields\\.io\\/badge\\/.*prefix=&PATTERN&\\)';
  static BASE_README_PATH = './README.md';
  static BADGES = {};

  /* istanbul ignore next */
  private constructor() {
    if (!Globals.instance) {
      Globals.instance = new Globals();
    }
    return Globals.instance;
  }

  static init(config: DependencyOptionsInterface) {
    this.DEFAULT_COV_PATH = config?.coverage_file_path || this.DEFAULT_COV_PATH;
    this.BASE_README_PATH = config?.readmeFilePath || this.BASE_README_PATH;
    this.BADGES = config?.badges || this.BADGES;
  }

  static loadArgv(): Promise<void> {
    return new Promise((resolve, _reject) => {
      type Options = keyof typeof ArgvOptionsEnum;

      Object.keys(ArgvOptionsEnum).forEach((argvOptionKey) => {
        const argvOptionIndex = process.argv.indexOf(ArgvOptionsEnum[argvOptionKey as Options]);
        if (argvOptionIndex !== -1) {
          const globalKey: Options = argvOptionKey as any;
          Globals[globalKey] = process.argv[argvOptionIndex + 1];
        }
      });
      resolve();
    })
  }
}
