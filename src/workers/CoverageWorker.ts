import { BadgeStatsInterface, BadgeStatsObjInterface } from '../interfaces/BadgeStatsInterface';
import { CoverageInterface, CoverageColumnInterface } from '../interfaces/CoverageInterface';
import { ColorValidation } from '../validations/ColorValidation';
import { FileUtils } from '../utils/FileUtils';
import { Globals } from '../Globals';
import { ParserFactory } from '../parsers/ParserFactory';

export class Coverage {
  private static medianCov: number;
  private static fileBody: string;
  private static CoverageJSON: CoverageInterface;

  static init() {
    this.fileBody = FileUtils.readFile(Globals.DEFAULT_COV_PATH);
    const parser = ParserFactory.getParser(Globals.FORMAT);
    this.CoverageJSON = parser.parse(this.fileBody);
    this.medianCov = 0;
    return this;
  }

  static validate(): BadgeStatsObjInterface {
    const coveragesCategories: BadgeStatsObjInterface = {};

    Globals.COVERAGE_CATEGORIES.forEach((key) => {
      coveragesCategories[key] = this.getCoverageStats(this.CoverageJSON.total[key]);
      this.medianCov += this.CoverageJSON.total[key].pct;
    });
    coveragesCategories['coverage'] = this.getCoverageStats({
      pct: this.medianCov / Globals.COVERAGE_CATEGORIES.length,
    });

    return coveragesCategories;
  }

  static getCoverageStats(covColumn: CoverageColumnInterface): BadgeStatsInterface {
    return {
      coverage: covColumn.pct,
      color: ColorValidation.validate(covColumn.pct),
    };
  }
}
