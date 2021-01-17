import { BadgeOptionsObjectInterface } from './BadgeOptionsInterface';

export interface DependencyOptionsInterface {
  badges?: ConfigBadge;
  covFilePath?: string;
  readmeFilePath?: string;
}

export interface ConfigBadge {
  [key: string]: BadgeOptionsObjectInterface;
}
