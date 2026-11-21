import * as migration_20261120_230949_initial from './20261120_230949_initial';

export const migrations = [
  {
    up: migration_20261120_230949_initial.up,
    down: migration_20261120_230949_initial.down,
    name: '20261120_230949_initial'
  },
];
