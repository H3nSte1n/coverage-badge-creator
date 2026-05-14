import { CoverageParser } from './CoverageParserInterface';
import { CoverageInterface } from '../interfaces/CoverageInterface';

export class CoberturaParser implements CoverageParser {
  parse(fileContent: string): CoverageInterface {
    // Match attributes on the root <coverage> element (appears first in the file)
    const rootElement = fileContent.match(/<coverage[^>]+>/);
    const rootTag = rootElement ? rootElement[0] : '';

    const lineRateMatch = rootTag.match(/line-rate="([0-9.]+)"/);
    const branchRateMatch = rootTag.match(/branch-rate="([0-9.]+)"/);

    const linesPct = lineRateMatch ? parseFloat(lineRateMatch[1]) * 100 : 0;
    const branchPct = branchRateMatch ? parseFloat(branchRateMatch[1]) * 100 : 0;

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
