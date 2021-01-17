export interface CoverageInterface {
  total: Total;
}

interface Total {
  [x: string]: CoverageColumnInterface;
}

export interface CoverageColumnInterface {
  pct: number;
}
