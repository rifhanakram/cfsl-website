import * as migration_20260923_183536_initial from './20260923_183536_initial';

export const migrations = [
  {
    up: migration_20260923_183536_initial.up,
    down: migration_20260923_183536_initial.down,
    name: '20260923_183536_initial'
  },
];
