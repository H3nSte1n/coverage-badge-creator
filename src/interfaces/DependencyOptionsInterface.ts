import { BadgeOptionsObjectInterface } from './BadgeOptionsInterface';
import { FormatEnum } from '../enums/FormatEnum';

export interface DependencyOptionsInterface {
  badges?: ConfigBadge;
  coverage_file_path?: string;
  readmeFilePath?: string;
  format?: FormatEnum;
}

export interface ConfigBadge {
  [key: string]: BadgeOptionsObjectInterface;
}
