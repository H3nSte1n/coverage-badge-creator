export interface BadgeStatsInterface {
  coverage: number;
  color: string;
}

export interface BadgeStatsObjInterface {
  [key: string]: BadgeStatsInterface;
}
