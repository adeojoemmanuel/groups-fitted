import { getDb } from '../migrations-utils/connector';

export const up = async () => {
  const db = await getDb();
  /*
      Code your update script here!
   */
  const events = await db.collection('events').find().toArray();
  for (const event of events) {
    await db
      .collection('events')
      .findOneAndUpdate(
        { _id: event._id },
        { $set: { admins: [event.creator] } },
      );
  }
};

export const down = async () => {
  const db = await getDb();
  /*
      Code you downgrade script here!
   */
};
