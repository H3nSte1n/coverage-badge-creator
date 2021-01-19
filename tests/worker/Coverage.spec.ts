import { createMock } from 'ts-auto-mock';
import { Coverage } from '../../src/worker/Coverage';
import { FileUtils } from '../../src/utils/FileUtils';
import { ColorValidation } from '../../src/validations/ColorValidation';
import { BadgeStatsInterface } from '../../src/interfaces/BadgeStatsInterface';
import { Globals } from '../../src/Globals';

describe('Coverage', () => {
  beforeAll(() => {
    Globals.DEFAULT_COV_PATH = "./tests/data/test-coverage-report.json"
  })
  beforeEach(() => {
    jest.clearAllMocks();
  })

  describe('#init', () => {

    it('should call #readFile and #parseFile', () => {
      const readFileSpy = jest.spyOn(FileUtils, 'readFile');
      const parseFileSpy = jest.spyOn(FileUtils, 'parseFile');
      Coverage.init();
      expect(readFileSpy).toHaveBeenCalled();
      expect(parseFileSpy).toHaveBeenCalled();
    })
    it('should return class instance', () => {
      const result = Coverage.init();
      expect(result).toBe(Coverage);
    })
  })

  describe('#validate', () => {

    it('should return object with coverage columns', () => {
      const result = Coverage.validate();
      expect(Object.keys(result).length).toBeGreaterThan(0)
    })

    it('should call this.getCoverageStats 4 times', () => {
      const getCoverageStatsSpy = jest.spyOn(Coverage, 'getCoverageStats');
      Coverage.validate();
      expect(getCoverageStatsSpy).toHaveBeenCalledTimes(Globals.COVERAGE_CATEGORIES.length + 1);
    })
  })

  describe('#getCoverageStats', () => {
    it('should call #ColorValidation.validate', () => {
      const validateSpy = jest.spyOn(ColorValidation, 'validate');
      const fakeCovColumn = {pct: 89};
      Coverage.getCoverageStats(fakeCovColumn);
      expect(validateSpy).toHaveBeenCalled();
    })

    it('should return object of interface #CoverageColumnInterface', () => {
      const mock: BadgeStatsInterface = createMock<BadgeStatsInterface>();
      const fakeCovColumn = {pct: 70};
      const result = Coverage.getCoverageStats(fakeCovColumn);
      expect(Object.keys(result)).toEqual(Object.keys(mock))
    })
  })
})