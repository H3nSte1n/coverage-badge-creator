import { CoverageParser } from './CoverageParserInterface';
import { CoverageInterface } from '../interfaces/CoverageInterface';

interface CoveragePyTotals {
  percent_covered: number;
  num_branches?: number;
  covered_branches?: number;
}

interface CoveragePyJson {
  totals: CoveragePyTotals;
}

export class CoveragePyJsonParser implements CoverageParser {
  parse(fileContent: string): CoverageInterface {
    const data = JSON.parse(fileContent) as CoveragePyJson;
    const totals = data.totals;

    const linesPct = totals.percent_covered ?? 0;

    let branchPct = linesPct;
    if (totals.num_branches !== undefined && totals.num_branches > 0) {
      branchPct = ((totals.covered_branches ?? 0) / totals.num_branches) * 100;
    }

    return {
      total: {
        lines:      { pct: linesPct },
        statements: { pct: linesPct },
        branches:   { pct: branchPct },
        functions:  { pct: linesPct },
      },
    };
  }
}
