import { CoverageInterface } from '../interfaces/CoverageInterface';

export interface CoverageParser {
  parse(fileContent: string): CoverageInterface;
}
