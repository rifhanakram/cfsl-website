import * as migration_20260923_183536_initial from './20260923_183536_initial';
import * as migration_20260924_035153_blob_object_key from './20260924_035153_blob_object_key';

export const migrations = [
  {
    up: migration_20260923_183536_initial.up,
    down: migration_20260923_183536_initial.down,
    name: '20260923_183536_initial',
  },
  {
    up: migration_20260924_035153_blob_object_key.up,
    down: migration_20260924_035153_blob_object_key.down,
    name: '20260924_035153_blob_object_key'
  },
];
