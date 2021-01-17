import { ColorsEnum } from "../../src/enums/ColorsEnum"
import { ColorValidation } from "../../src/validations/ColorValidation"

describe('ColorValidation', () => {

  describe('validate', () => {
    it(`should return ${ColorsEnum.VERY_LOW}`, () => {
      const color = ColorValidation.validate(9);
      expect(color).toEqual(ColorsEnum.VERY_LOW);
    })
    it(`should return ${ColorsEnum.LOW}`, () => {
      const color = ColorValidation.validate(30);
      expect(color).toEqual(ColorsEnum.LOW);
    })
    it(`should return ${ColorsEnum.SOME}`, () => {
      const color = ColorValidation.validate(45);
      expect(color).toEqual(ColorsEnum.SOME);
    })
    it(`should return ${ColorsEnum.MUCH}`, () => {
      const color = ColorValidation.validate(72);
      expect(color).toEqual(ColorsEnum.MUCH);
    })
    it(`should return ${ColorsEnum.GOOD}`, () => {
      const color = ColorValidation.validate(100);
      expect(color).toEqual(ColorsEnum.GOOD);
    })
  })
})