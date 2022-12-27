import { Db } from 'mongodb';

const createCollectionIfNotExist = async (db: Db, collectionName: string) => {
  process.stdout.write(`\r  - Check existence of collection: ${collectionName}...`);
  const collection = db.collection(collectionName);
  if (null === collection) {
    process.stdout.write(`\r  - Creating collection: ${collectionName}...`);
    await db.createCollection(collectionName);
  }
};

export const _001_createCollections = async (db: Db): Promise<void> => {
  console.log('Run createCollections script');

  await createCollectionIfNotExist(db, "commit-entries");
  await createCollectionIfNotExist(db, "commits");
  await createCollectionIfNotExist(db, "entries");
  await createCollectionIfNotExist(db, "locales");
  await createCollectionIfNotExist(db, "organizations");
  await createCollectionIfNotExist(db, "projects");
  await createCollectionIfNotExist(db, "users");

  process.stdout.write('\r' + ' '.repeat(100));
  console.log('\r  - Collections created!');
};
