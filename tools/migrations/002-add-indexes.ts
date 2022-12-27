import { Db } from 'mongodb';

const createIndex = async (db: Db, collectionName: string, index: any, name?: string) => {
  name = name || `${collectionName}_${index}_index`;
  process.stdout.write(`\r  - Add ${index} index to collection ${collectionName}...`);
  await db.collection(collectionName).createIndex(index, {
    name,
    unique: true,
  });
};

export const _002_addIndexes = async (db: Db) => {
  console.log('Run addIndexes script');

  await createIndex(db, "commit-entries", "id");
  await createIndex(db, "commits", "id");
  await createIndex(db, "entries", "id");
  await createIndex(db, "entries", { "projectId": 1, "name": 1 }, "entries_index_unique_key-project");
  await createIndex(db, "locales", "tag");
  await createIndex(db, "organizations", "id");
  await createIndex(db, "projects", "id");
  await createIndex(db, "users", "id");
  await createIndex(db, "users", "primaryEmail");

  process.stdout.write('\r' + ' '.repeat(100));
  console.log('\r  - Indexes created!');
};
