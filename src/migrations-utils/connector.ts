import { Db, MongoClient } from 'mongodb';
import { config } from '../config/index';

const MONGO_URL = config.db.uri;

export const getDb = async (): Promise<Db> => {
  const client: MongoClient = await MongoClient.connect(MONGO_URL, {
    // useUnifiedTopology: true,
  });
  return client.db();
};
