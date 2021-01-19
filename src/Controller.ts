import { Coverage } from './workers/CoverageWorker';
import { Readme } from './workers/ReadmeWorker';
import { BadgeStatsObjInterface } from './interfaces/BadgeStatsInterface';
import { Globals } from './Globals';

export class Controller {
  static run() {
    const BadgeStatsObj: BadgeStatsObjInterface = Coverage.init().validate();

    Readme.prepareData(BadgeStatsObj, Globals.BADGES).insertCov();
  }
}
