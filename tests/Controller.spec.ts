import { Controller } from '../src/Controller';
import { Coverage } from '../src/worker/Coverage';
import { Readme } from '../src/worker/Readme';

describe('Controller', () => {
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