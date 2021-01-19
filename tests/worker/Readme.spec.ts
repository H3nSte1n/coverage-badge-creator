import { createMock } from "ts-auto-mock"
import { Badge } from "../../src/worker/Badge"
import { ConfigBadge } from "../../src/interfaces/DependencyOptionsInterface"
import { Readme } from "../../src/worker/Readme"
import { FileUtils } from "../../src/utils/FileUtils"
import { StringUtils } from "../../src/utils/StringUtils"

describe('Readme', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  })

  describe('#prepareData', () => {

    const BadgeStatsObj = {
      statements: {
        coverage: 90,
        color: ""
      },
      branches: {
        coverage: 90,
        color: ""
      },
      functions: {
        coverage: 90,
        color: ""
      }
    }

    it('should create three badges', () => {
      const configBadgeMock: ConfigBadge = createMock<ConfigBadge>();
      const createSpy = jest.spyOn(Badge, 'create');
      Readme.prepareData(BadgeStatsObj, configBadgeMock)
      
      expect(createSpy).toHaveBeenCalledTimes(3);
    })

    it('should return instance of Readme', () => {
      const configBadgeMock: ConfigBadge = createMock<ConfigBadge>();
      const result = Readme.prepareData({}, configBadgeMock)
      expect(result).toBe(Readme);
    })

    it('should cancel run if BadgeStatsObj is null', () => {
      const configBadgeMock: ConfigBadge = createMock<ConfigBadge>();
      const createSpy = jest.spyOn(Badge, 'create');
      Readme.prepareData({}, configBadgeMock)
      
      expect(createSpy).toHaveBeenCalledTimes(0);
    })
  })

  describe('#insertCov', () => {
    const BadgeStatsObj = {
      statements: {
        coverage: 90,
        color: ""
      },
      branches: {
        coverage: 90,
        color: ""
      },
      functions: {
        coverage: 90,
        color: ""
      }
    }

    it('should call #readFile', () => {
      const readFileSpy = jest.spyOn(FileUtils, 'readFile');
      Readme.insertCov();
      expect(readFileSpy).toHaveBeenCalledTimes(1)
    })
    it('should call #replaceString 0 times if replacementAttributes is empty', () => {
      const readFileSpy = jest.spyOn(StringUtils, 'replaceString');
      Readme.insertCov();
      expect(readFileSpy).toHaveBeenCalledTimes(0)
    })
    it('should call #replaceString 3 times if replacementAttributes has 3 items', () => {
      const configBadgeMock: ConfigBadge = createMock<ConfigBadge>();
      const readFileSpy = jest.spyOn(StringUtils, 'replaceString');
      Readme.prepareData(BadgeStatsObj, configBadgeMock).insertCov();
      expect(readFileSpy).toHaveBeenCalledTimes(6)
    })
    it('should call #writeFile', () => {
      const writeFileSpy = jest.spyOn(FileUtils, 'writeFile');
      Readme.insertCov();
      expect(writeFileSpy).toHaveBeenCalledTimes(1)
    })
  })
})