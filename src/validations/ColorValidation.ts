import { ColorsEnum } from '../enums/ColorsEnum';

export class ColorValidation {
  static validate(num: number): string {
    switch (true) {
      case num < 15:
        return ColorsEnum.VERY_LOW;
      case num < 45:
        return ColorsEnum.LOW;
      case num < 65:
        return ColorsEnum.SOME;
      case num < 80:
        return ColorsEnum.MUCH;
      case num < 101:
        return ColorsEnum.GOOD;
      default:
        return 'grey';
    }
  }
}
