import { getDb } from '../migrations-utils/connector';

export const up = async () => {
  const db = await getDb();
  /*
      Code your update script here!
   */
  const groups = await db.collection('groups').find().toArray();
  for (const group of groups) {
    const event = await db
      .collection('events')
      .findOneAndUpdate(
        { _id: group.event },
        { $set: { creator: group.initiator } },
      );
  }
};

export const down = async () => {
  const db = await getDb();
  /*
      Code you downgrade script here!
   */
};
