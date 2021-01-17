import { StringUtils } from "../../src/utils/StringUtils"

describe('StringUtils', () => {
  describe('replaceString', () => {
    it('should replace pattern with replacement', () => {
      const result = StringUtils.replaceString("$foo$", "bar", "$foo$bar")
      expect(result).toEqual("barbar")
    })
  })
})