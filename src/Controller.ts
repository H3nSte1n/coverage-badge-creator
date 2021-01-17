import { Coverage } from './worker/Coverage';
import { Readme } from './worker/Readme';
import { BadgeStatsObjInterface } from './interfaces/BadgeStatsInterface';
import { Globals } from './Globals';

export class Controller {
  static run() {
    const BadgeStatsObj: BadgeStatsObjInterface = Coverage.init().validate();

    Readme.prepareData(BadgeStatsObj, Globals.BADGES).insertCov();
  }
}
