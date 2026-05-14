import { CoverageParser } from './CoverageParserInterface';
import { CoverageInterface } from '../interfaces/CoverageInterface';

export class LcovParser implements CoverageParser {
  parse(fileContent: string): CoverageInterface {
    let lf = 0, lh = 0, brf = 0, brh = 0, fnf = 0, fnh = 0;

    for (const line of fileContent.split('\n')) {
      const colonIndex = line.indexOf(':');
      if (colonIndex === -1) continue;
      const key = line.substring(0, colonIndex).trim();
      const val = parseInt(line.substring(colonIndex + 1), 10);
      if (isNaN(val)) continue;

      if (key === 'LF') lf += val;
      else if (key === 'LH') lh += val;
      else if (key === 'BRF') brf += val;
      else if (key === 'BRH') brh += val;
      else if (key === 'FNF') fnf += val;
      else if (key === 'FNH') fnh += val;
    }

    const linesPct = lf > 0 ? (lh / lf) * 100 : 0;
    const branchPct = brf > 0 ? (brh / brf) * 100 : 0;
    const fnPct = fnf > 0 ? (fnh / fnf) * 100 : 0;

    return {
      total: {
        lines:      { pct: linesPct },
        statements: { pct: linesPct },
        branches:   { pct: branchPct },
        functions:  { pct: fnPct },
      },
    };
  }
}
