import { BadgeOptionsObjectInterface } from './BadgeOptionsInterface';

export interface DependencyOptionsInterface {
  badges?: ConfigBadge;
  coverage_file_path?: string;
  readmeFilePath?: string;
}

export interface ConfigBadge {
  [key: string]: BadgeOptionsObjectInterface;
}
