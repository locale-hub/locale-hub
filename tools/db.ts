import * as MongoClient from 'mongodb';
import { Db, Logger } from 'mongodb';

/**
 * Connect to the db instance
 */
export const dbConnect = async (
  uri: string,
  name: string
): Promise<Db> => {
  const connect = await MongoClient.connect(uri, {
    useUnifiedTopology: true,
  });

  Logger.setLevel('debug');
  Logger.filter('class', ['Db']); // Only log statements on 'Db' class

  return connect.db(name);
};
