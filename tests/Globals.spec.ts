import { Globals } from "../src/Globals"

describe('Globals', () => {

  describe('init', () => {
    it('should take default values if config property not exist', () => {
      Globals.init({});
      expect(Globals.DEFAULT_COV_PATH).toEqual('./coverage/coverage-summary.json');
      expect(Globals.BASE_README_PATH).toEqual('./README.md');
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
      expect(Globals.DEFAULT_COV_PATH).toEqual(config.coverage_file_path);
      expect(Globals.BASE_README_PATH).toEqual(config.readmeFilePath);
      expect(Globals.BADGES).toEqual(config.badges);
    })
  })

  describe('loadArgv', () => {
    it('should change config path when passing the --config option', () => {
      Globals.CONFIG_PATH = 'bar/foo.json';
      process.argv = ['--config', 'foo/bar.json'];

      Globals.loadArgv();
      expect(Globals.CONFIG_PATH).toEqual('foo/bar.json');
    })
  })
})