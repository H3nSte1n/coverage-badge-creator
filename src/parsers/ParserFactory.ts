import { CoverageParser } from './CoverageParserInterface';
import { IstanbulJsonParser } from './IstanbulJsonParser';
import { LcovParser } from './LcovParser';
import { CoberturaParser } from './CoberturaParser';
import { CoveragePyJsonParser } from './CoveragePyJsonParser';
import { FormatEnum } from '../enums/FormatEnum';

export class ParserFactory {
  static getParser(format?: FormatEnum): CoverageParser {
    switch (format) {
      case FormatEnum.LCOV:
        return new LcovParser();
      case FormatEnum.COBERTURA:
        return new CoberturaParser();
      case FormatEnum.COVERAGE_PY:
        return new CoveragePyJsonParser();
      default:
        return new IstanbulJsonParser();
    }
  }
}
