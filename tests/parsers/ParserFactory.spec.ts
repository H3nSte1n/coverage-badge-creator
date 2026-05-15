import { ParserFactory } from '../../src/parsers/ParserFactory';
import { IstanbulJsonParser } from '../../src/parsers/IstanbulJsonParser';
import { LcovParser } from '../../src/parsers/LcovParser';
import { CoberturaParser } from '../../src/parsers/CoberturaParser';
import { CoveragePyJsonParser } from '../../src/parsers/CoveragePyJsonParser';
import { FormatEnum } from '../../src/enums/FormatEnum';

describe('ParserFactory', () => {
  describe('#getParser', () => {
    it('should return IstanbulJsonParser when format is undefined', () => {
      expect(ParserFactory.getParser(undefined)).toBeInstanceOf(IstanbulJsonParser);
    });

    it('should return IstanbulJsonParser for FormatEnum.ISTANBUL', () => {
      expect(ParserFactory.getParser(FormatEnum.ISTANBUL)).toBeInstanceOf(IstanbulJsonParser);
    });

    it('should return LcovParser for FormatEnum.LCOV', () => {
      expect(ParserFactory.getParser(FormatEnum.LCOV)).toBeInstanceOf(LcovParser);
    });

    it('should return CoberturaParser for FormatEnum.COBERTURA', () => {
      expect(ParserFactory.getParser(FormatEnum.COBERTURA)).toBeInstanceOf(CoberturaParser);
    });

    it('should return CoveragePyJsonParser for FormatEnum.COVERAGE_PY', () => {
      expect(ParserFactory.getParser(FormatEnum.COVERAGE_PY)).toBeInstanceOf(CoveragePyJsonParser);
    });
  });
});
