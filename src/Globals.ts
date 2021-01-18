import { DependencyOptionsInterface } from './interfaces/DependencyOptionsInterface';

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
    this.DEFAULT_COV_PATH = config?.covFilePath || this.DEFAULT_COV_PATH;
    this.BASE_README_PATH = config?.readmeFilePath || this.BASE_README_PATH;
    this.BADGES = config?.badges || this.BADGES;
  }
}
