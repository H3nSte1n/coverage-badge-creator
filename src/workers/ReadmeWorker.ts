import { Badge } from './BadgeWorker';
import { BadgeStatsObjInterface } from '../interfaces/BadgeStatsInterface';
import { ConfigBadge } from '../interfaces/DependencyOptionsInterface';
import { ReplacementAttributes } from '../interfaces/ReplacementAttributes';
import { Globals } from '../Globals';
import { FileUtils } from '../utils/FileUtils';
import { StringUtils } from '../utils/StringUtils';

export class Readme {
  private static replacementAttributes: ReplacementAttributes[];

  static prepareData(BadgeStatsObj: BadgeStatsObjInterface, urlConfig: ConfigBadge) {
    this.replacementAttributes = [];
    if (!BadgeStatsObj) return this;

    for (const BadgeStatsColumnKey of Object.keys(BadgeStatsObj)) {
      this.replacementAttributes.push({
        pattern: `\\$${BadgeStatsColumnKey}\\$`,
        url: Badge.create(
          urlConfig[BadgeStatsColumnKey] || {},
          BadgeStatsObj[BadgeStatsColumnKey],
          BadgeStatsColumnKey,
        ),
      });
    }
    return this;
  }

  static insertCov() {
    const filePath = Globals.BASE_README_PATH;
    let file: string = FileUtils.readFile(filePath);

    this.replacementAttributes.forEach((util) => {
      const baseUrlPattern = StringUtils.replaceString('&PATTERN&', util.pattern, Globals.BADGE_BASE_URL_PATTERN);
      const urlPattern = new RegExp(`(${baseUrlPattern})|(${util.pattern})`, 'gi');
      file = StringUtils.replaceString(urlPattern, util.url, file);
    });
    FileUtils.writeFile(filePath, file);
  }
}
