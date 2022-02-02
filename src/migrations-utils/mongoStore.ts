'use strict';
import * as migrate from 'migrate';
import { MongoClient } from 'mongodb';
import { config } from '../config';
import { getDb } from './connector';

class MongoDbStore {
  async load(fn): Promise<any> {
    let client = null;
    let data = null;
    try {
      client = await MongoClient.connect(config.db.uri);
      const db = client.db(); // await getDb()
      data = await db.collection('migrations').find().toArray();
      if (data.length !== 1) {
        console.log(
          'Cannot read migrations from database. If this is the first time you run migrations, then this is normal.',
        );
        return fn(null, {});
      }
    } catch (err) {
      throw err;
    } finally {
      client.close();
    }
    return fn(null, data[0]);
  }

  async save(set, fn): Promise<any> {
    let client = null;
    let result = null;
    try {
      client = await MongoClient.connect(config.db.uri);
      const db = client.db();
      const toAdd = set.migrations.filter(
        (migration) => set.lastRun === migration.title,
      );
      result = await db.collection('migrations').updateMany(
        {},
        {
          $set: {
            lastRun: set.lastRun,
            updatedAt: new Date(),
          },
          $setOnInsert: { createdAt: new Date() },
          $push: {
            migrations: { $each: toAdd },
          },
        },
        { upsert: true },
      );
    } catch (err) {
      throw err;
    } finally {
      client.close();
    }

    return fn(null, result);
  }
}
module.exports = MongoDbStore;
/**
 * Main application code
 */
// migrate.load(
//   {
//     // Set class as custom stateStore
//     stateStore: new MongoDbStore(),
//   },
//   function (err, set) {
//     if (err) {
//       throw err;
//     }

//     set.up((err2) => {
//       if (err2) {
//         throw err2;
//       }
//       console.log('Migrations successfully ran');
//     });
//   },
// );
