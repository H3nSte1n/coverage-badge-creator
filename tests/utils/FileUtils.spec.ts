import fs from 'fs';
import { FileUtils } from '../../src/utils/FileUtils';

describe('FileUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  })
  
  describe('checkFileExist', () => {
    it('should return false if file not exist', () => {
      const existsSyncSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(false);
      const result = FileUtils.checkFileExist('');
      expect(existsSyncSpy).toHaveBeenCalled();
      expect(result).toBeFalsy()
    })
    it('should return true if file exist', () => {
      const existsSyncSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(true);
      const result = FileUtils.checkFileExist('');
      expect(existsSyncSpy).toHaveBeenCalled();
      expect(result).toBeTruthy();
    })
  })

  describe('readFile', () => {
    it('should call #readFileSync', () => {
      const readFileSyncSpy = jest.spyOn(fs, 'readFileSync').mockReturnValue('');
      FileUtils.readFile('');
      expect(readFileSyncSpy).toHaveBeenCalled();
    })
    it('should return string', () => {
      const result = FileUtils.readFile('');
      expect(typeof result).toEqual('string');
    })
  })

  describe('parseFile', () => {
    it('should call #parse', () => {
      const parseSync = jest.spyOn(JSON, 'parse').mockReturnValue('');
      FileUtils.parseFile<string>('');
      expect(parseSync).toHaveBeenCalled();
    })
    it('should return string if generic equals string', () => {
      const result = FileUtils.parseFile<string>('');
      expect(typeof result).toEqual('string');
    })
  })

  describe('writeFile', () => {
    it('should call #writeFileSync', () => {
      const writeFileSyncSpy = fs.writeFileSync = jest.fn();
      FileUtils.writeFile('', '');
      expect(writeFileSyncSpy).toHaveBeenCalled();
    })
  })
})