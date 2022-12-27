
import { globalConfiguration as config } from '../config/global.config';
import { logError } from './logger';
import { dbConnect } from './db';
import { _001_createCollections } from './migrations/001-create-collections';
import { _002_addIndexes } from './migrations/002-add-indexes';

const execute = async (): Promise<void> => {
  const db = await dbConnect(config.database.uri, config.database.name);
  await _001_createCollections(db);
  await _002_addIndexes(db);
};

execute().catch(logError);
