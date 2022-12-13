import MongoClient, {Db, FilterQuery, Logger, UpdateQuery} from 'mongodb';

let client: Db;

/**
 * Connect to the db instance
 */
export const dbConnect = async (uri: string, name: string): Promise<boolean> => {
  try {
    const connect = await MongoClient.connect(uri, {
      useUnifiedTopology: true,
    });

    Logger.setLevel('debug');
    Logger.filter('class', ['Db']); // Only log statements on 'Db' class

    client = connect.db(name);

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

/**
 * Insert a document to db
 * @template T Type of document to insert
 * @param {string} collection the collection where the document will be inserted
 * @param {T} item The document to insert
 * @return {T} The insert document, null if failed to insert
 */
export const dbInsert = async <T> (collection: string, item: T): Promise<T | null> => {
  try {
    return (await client.collection(collection).insertOne(item)).ops[0];
  } catch (e) {
    console.log(e);
    return null;
  }
};

/**
 * Update a document in db
 * @template T Type of document to update
 * @param {string} collection the collection where the document will be updated
 * @param {T} query Document conditions (an id, or condition the document should meet)
 * @param {T} updated The new document
 * @return {boolean} true if updated with success, false otherwise
 */
export const dbUpdate = async <T> (collection: string, query: FilterQuery<T>, updated: UpdateQuery<T>)
  : Promise<boolean> => {
  try {
    await client.collection(collection).updateOne(query, updated);

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

/**
 * Retrieve a single document from db
 * @template T Type of document to find
 * @param {string} collection the collection where the document will be searched
 * @param {T} query Document conditions (an id, or condition the document should meet)
 * @return {T} The document found, null if no result found
 */
export const dbSingle = async <T> (collection: string, query: FilterQuery<T>): Promise<T | null> => {
  try {
    return await client.collection(collection).findOne<T>(query);
  } catch (e) {
    console.log(e);
    return null;
  }
};

/**
 * Retrieve a list of documents from db
 * @template T Type of documents to find
 * @param {string} collection the collection where the documents will be searched
 * @param {T} query Document conditions (an id, or condition the document should meet)
 * @return {T[]} The documents found, empty array if no result found
 */
export const dbMultiple = async <T> (collection: string, query: FilterQuery<T>): Promise<T[] | null> => {
  try {
    return await client.collection(collection).find<T>(query, {}).toArray();
  } catch (e) {
    console.log(e);
    return null;
  }
};

/**
 * Retrieve a list of documents from aggregate db operation
 * @template T Type of documents to find
 * @param {string} collection the collection where the documents will be searched
 * @param {T} query Document conditions (an id, or condition the document should meet)
 * @returns {T[]} The documents found, empty array if no result found
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export const dbAggregate = async <T> (collection: string, query: object[]): Promise<T[] | null> => {
  try {
    return await client.collection(collection).aggregate<T>(query).toArray();
  } catch (e) {
    console.log(e);
    return null;
  }
};

/**
 * Delete a list of documents from db
 * @template T Type of documents to find
 * @param {string} collection the collection where the documents will be deleted
 * @param {T} query Document conditions (an id, or condition the document should meet)
 * @return {boolean} true if deleted, false otherwise
 */
export const dbDelete = async <T> (collection: string, query: FilterQuery<T>): Promise<boolean> => {
  try {
    await client.collection(collection).deleteMany(query);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

