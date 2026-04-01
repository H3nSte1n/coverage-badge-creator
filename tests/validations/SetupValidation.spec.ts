import { SetupValidation } from '../../src/validations/SetupValidation';
import { FileUtils } from '../../src/utils/FileUtils';
import { Globals } from '../../src/Globals';

describe('SetupValidation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('#scan', () => {
    it('should resolve when both coverage and readme files exist', async () => {
      jest.spyOn(FileUtils, 'checkFileExist').mockReturnValue(true);
      const consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation();

      await SetupValidation.scan();

      expect(consoleInfoSpy).toHaveBeenCalled();
    });

    it('should reject when coverage file does not exist', async () => {
      jest.spyOn(FileUtils, 'checkFileExist').mockReturnValue(false);
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      await SetupValidation.scan();

      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('#loadConfig', () => {
    it('should return early when config file does not exist', async () => {
      jest.spyOn(FileUtils, 'checkFileExist').mockReturnValue(false);
      jest.spyOn(console, 'info').mockImplementation();
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const readFileSpy = jest.spyOn(FileUtils, 'readFile');

      await SetupValidation.loadConfig();

      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('No Config file found'));
      expect(readFileSpy).not.toHaveBeenCalled();
    });

    it('should parse config when config file exists', async () => {
      const mockConfig = JSON.stringify({ coverage_file_path: './coverage/coverage-summary.json' });
      jest.spyOn(FileUtils, 'checkFileExist').mockReturnValue(true);
      jest.spyOn(FileUtils, 'readFile').mockReturnValue(mockConfig);
      jest.spyOn(console, 'info').mockImplementation();
      const initSpy = jest.spyOn(Globals, 'init');

      await SetupValidation.loadConfig();

      expect(initSpy).toHaveBeenCalled();
    });

    it('should reject when config file contains invalid JSON', async () => {
      jest.spyOn(FileUtils, 'checkFileExist').mockReturnValue(true);
      jest.spyOn(FileUtils, 'readFile').mockReturnValue('invalid json');
      jest.spyOn(console, 'info').mockImplementation();
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      await expect(SetupValidation.loadConfig()).rejects.toBeUndefined();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Parsing configuration file failed'),
      );
    });
  });
});
