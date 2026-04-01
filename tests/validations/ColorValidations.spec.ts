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

    it(`should return ${ColorsEnum.VERY_LOW} for negative values`, () => {
      const color = ColorValidation.validate(-1);
      expect(color).toEqual(ColorsEnum.VERY_LOW);
    })

    it(`should return ${ColorsEnum.VERY_LOW} at boundary 0`, () => {
      const color = ColorValidation.validate(0);
      expect(color).toEqual(ColorsEnum.VERY_LOW);
    })

    it(`should return ${ColorsEnum.LOW} at boundary 15`, () => {
      const color = ColorValidation.validate(15);
      expect(color).toEqual(ColorsEnum.LOW);
    })

    it(`should return ${ColorsEnum.SOME} at boundary 45`, () => {
      const color = ColorValidation.validate(45);
      expect(color).toEqual(ColorsEnum.SOME);
    })

    it(`should return ${ColorsEnum.MUCH} at boundary 65`, () => {
      const color = ColorValidation.validate(65);
      expect(color).toEqual(ColorsEnum.MUCH);
    })

    it(`should return ${ColorsEnum.GOOD} at boundary 80`, () => {
      const color = ColorValidation.validate(80);
      expect(color).toEqual(ColorsEnum.GOOD);
    })
  })
})