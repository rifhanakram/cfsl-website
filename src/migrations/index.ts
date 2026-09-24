import * as migration_20260923_183536_initial from './20260923_183536_initial';
import * as migration_20260924_035153_blob_object_key from './20260924_035153_blob_object_key';
import * as migration_20260924_040018_pages_navigation from './20260924_040018_pages_navigation';
import * as migration_20260924_040336_news from './20260924_040336_news';
import * as migration_20260924_041538_events_registrations from './20260924_041538_events_registrations';
import * as migration_20260924_041935_documents_downloads from './20260924_041935_documents_downloads';

export const migrations = [
  {
    up: migration_20260923_183536_initial.up,
    down: migration_20260923_183536_initial.down,
    name: '20260923_183536_initial',
  },
  {
    up: migration_20260924_035153_blob_object_key.up,
    down: migration_20260924_035153_blob_object_key.down,
    name: '20260924_035153_blob_object_key',
  },
  {
    up: migration_20260924_040018_pages_navigation.up,
    down: migration_20260924_040018_pages_navigation.down,
    name: '20260924_040018_pages_navigation',
  },
  {
    up: migration_20260924_040336_news.up,
    down: migration_20260924_040336_news.down,
    name: '20260924_040336_news',
  },
  {
    up: migration_20260924_041538_events_registrations.up,
    down: migration_20260924_041538_events_registrations.down,
    name: '20260924_041538_events_registrations',
  },
  {
    up: migration_20260924_041935_documents_downloads.up,
    down: migration_20260924_041935_documents_downloads.down,
    name: '20260924_041935_documents_downloads'
  },
];
