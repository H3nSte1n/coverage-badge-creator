import { Globals } from "../src/Globals"

describe('Globals', () => {

  describe('init', () => {
    it('should take default values if config property not exist', () => {
      Globals.init({});
      expect(Globals.DEFAULT_COV_PATH).toEqual('./coverage/report.json');
      expect(Globals.BASE_README_PATH).toEqual('./README.md');
      expect(Globals.BADGES).toEqual({});
    })
    
    it('should take config property if exist', () => {
      const config = {
        covFilePath: 'foo',
        readmeFilePath: 'bar',
        badges: {
          foo: {},
          bar: {}
        }
      }
      Globals.init(config)
      expect(Globals.DEFAULT_COV_PATH).toEqual(config.covFilePath);
      expect(Globals.BASE_README_PATH).toEqual(config.readmeFilePath);
      expect(Globals.BADGES).toEqual(config.badges);
    })
  })
})