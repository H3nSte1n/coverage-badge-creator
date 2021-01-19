import { Controller } from '../src/Controller';
import { Globals } from '../src/Globals';
import { Coverage } from '../src/workers/CoverageWorker';
import { Readme } from '../src/workers/ReadmeWorker';

describe('Controller', () => {
  beforeAll(() => {
    Globals.DEFAULT_COV_PATH = "./tests/data/test-coverage-report.json"
  })
  beforeEach(() => {
    jest.clearAllMocks();
  })

  describe('#run', () => {
    
    it('should call Coverage.#init, Coverage.#validate and #prepareData, #insertCov from Readme', () => {
      const initSpy = jest.spyOn(Coverage, 'init');
      const validateSpy = Coverage.validate = jest.fn();
      const prepareDataSpy = jest.spyOn(Readme, 'prepareData');
      const insertCovSpy = Readme.insertCov = jest.fn();

      Controller.run();
      expect(initSpy).toHaveBeenCalled();
      expect(validateSpy).toHaveBeenCalled();
      expect(prepareDataSpy).toHaveBeenCalled();
      expect(insertCovSpy).toHaveBeenCalled();
    })
  })
})