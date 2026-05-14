import { Globals } from "../src/Globals"
import { FormatEnum } from "../src/enums/FormatEnum";
import path from 'path';

describe('Globals', () => {

  describe('init', () => {
    it('should take default values if config property not exist', () => {
      Globals.init({});
      expect(Globals.DEFAULT_COV_PATH).toEqual(path.resolve(process.cwd(), './coverage/coverage-summary.json'));
      expect(Globals.BASE_README_PATH).toEqual(path.resolve(process.cwd(), './README.md'));
      expect(Globals.BADGES).toEqual({});
    })
    
    it('should take config property if exist', () => {
      const config = {
        coverage_file_path: 'foo',
        readmeFilePath: 'bar',
        badges: {
          foo: {},
          bar: {}
        }
      }
      Globals.init(config)
      expect(Globals.DEFAULT_COV_PATH).toEqual(path.resolve(process.cwd(), config.coverage_file_path));
      expect(Globals.BASE_README_PATH).toEqual(path.resolve(process.cwd(), config.readmeFilePath));
      expect(Globals.BADGES).toEqual(config.badges);
    })

    it('should resolve relative paths to absolute paths for coverage_file_path', () => {
      const config = {
        coverage_file_path: './coverage/coverage-summary.json',
      }
      Globals.init(config)
      expect(Globals.DEFAULT_COV_PATH).toEqual(path.resolve(process.cwd(), './coverage/coverage-summary.json'));
      expect(path.isAbsolute(Globals.DEFAULT_COV_PATH)).toBe(true);
    })

    it('should resolve relative paths to absolute paths for readmeFilePath', () => {
      const config = {
        readmeFilePath: './README.md',
      }
      Globals.init(config)
      expect(Globals.BASE_README_PATH).toEqual(path.resolve(process.cwd(), './README.md'));
      expect(path.isAbsolute(Globals.BASE_README_PATH)).toBe(true);
    })

    it('should resolve parent directory paths for monorepo scenarios', () => {
      const config = {
        coverage_file_path: './coverage/coverage-summary.json',
        readmeFilePath: '../../README.md',
      }
      Globals.init(config)
      expect(Globals.DEFAULT_COV_PATH).toEqual(path.resolve(process.cwd(), './coverage/coverage-summary.json'));
      expect(Globals.BASE_README_PATH).toEqual(path.resolve(process.cwd(), '../../README.md'));
      expect(path.isAbsolute(Globals.DEFAULT_COV_PATH)).toBe(true);
      expect(path.isAbsolute(Globals.BASE_README_PATH)).toBe(true);
    })

    it('should handle deeply nested parent directory paths', () => {
      const config = {
        readmeFilePath: '../../../root/README.md',
      }
      Globals.init(config)
      expect(Globals.BASE_README_PATH).toEqual(path.resolve(process.cwd(), '../../../root/README.md'));
      expect(path.isAbsolute(Globals.BASE_README_PATH)).toBe(true);
    })

    it('should keep absolute paths unchanged', () => {
      const absolutePath = path.resolve('/absolute/path/to/README.md');
      const config = {
        readmeFilePath: absolutePath,
      }
      Globals.init(config)
      expect(Globals.BASE_README_PATH).toEqual(absolutePath);
      expect(path.isAbsolute(Globals.BASE_README_PATH)).toBe(true);
    })

    it('should handle mixed relative and absolute paths', () => {
      const absoluteCoveragePath = path.resolve('/absolute/coverage/coverage-summary.json');
      const config = {
        coverage_file_path: absoluteCoveragePath,
        readmeFilePath: '../../README.md',
      }
      Globals.init(config)
      expect(Globals.DEFAULT_COV_PATH).toEqual(absoluteCoveragePath);
      expect(Globals.BASE_README_PATH).toEqual(path.resolve(process.cwd(), '../../README.md'));
      expect(path.isAbsolute(Globals.DEFAULT_COV_PATH)).toBe(true);
      expect(path.isAbsolute(Globals.BASE_README_PATH)).toBe(true);
    })

    it('should set FORMAT from config when format is provided', () => {
      Globals.init({ format: FormatEnum.LCOV });
      expect(Globals.FORMAT).toEqual(FormatEnum.LCOV);
    })

    it('should leave FORMAT unchanged when format is not in config', () => {
      Globals.FORMAT = undefined;
      Globals.init({});
      expect(Globals.FORMAT).toBeUndefined();
    })

    it('should set FORMAT for all supported format values', () => {
      Globals.init({ format: FormatEnum.COBERTURA });
      expect(Globals.FORMAT).toEqual(FormatEnum.COBERTURA);

      Globals.init({ format: FormatEnum.COVERAGE_PY });
      expect(Globals.FORMAT).toEqual(FormatEnum.COVERAGE_PY);

      Globals.init({ format: FormatEnum.ISTANBUL });
      expect(Globals.FORMAT).toEqual(FormatEnum.ISTANBUL);
    })
  })

  describe('loadArgv', () => {
    it('should change config path when passing the --config option', () => {
      Globals.CONFIG_PATH = 'bar/foo.json';
      process.argv = ['--config', 'foo/bar.json'];

      Globals.loadArgv();
      expect(Globals.CONFIG_PATH).toEqual('foo/bar.json');
    })

    it('should not change config path when no matching argv option exists', () => {
      Globals.CONFIG_PATH = 'bar/foo.json';
      process.argv = ['--unknown', 'foo/bar.json'];

      Globals.loadArgv();
      expect(Globals.CONFIG_PATH).toEqual('bar/foo.json');
    })
  })
})