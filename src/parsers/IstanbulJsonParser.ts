import { CoverageParser } from './CoverageParserInterface';
import { CoverageInterface } from '../interfaces/CoverageInterface';
import { FileUtils } from '../utils/FileUtils';

export class IstanbulJsonParser implements CoverageParser {
  parse(fileContent: string): CoverageInterface {
    return FileUtils.parseFile<CoverageInterface>(fileContent);
  }
}
