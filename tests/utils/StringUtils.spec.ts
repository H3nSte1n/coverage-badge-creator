import { StringUtils } from "../../src/utils/StringUtils"

describe('StringUtils', () => {
  describe('replaceString', () => {
    it('should replace pattern with replacement', () => {
      const result = StringUtils.replaceString("$foo$", "bar", "$foo$bar")
      expect(result).toEqual("barbar")
    })

    it('should replace using a RegExp pattern', () => {
      const result = StringUtils.replaceString(/foo/gi, "bar", "Foo foo FOO")
      expect(result).toEqual("bar bar bar")
    })

    it('should return original string when pattern is not found', () => {
      const result = StringUtils.replaceString("notfound", "bar", "hello world")
      expect(result).toEqual("hello world")
    })
  })
})