import { getDb } from '../migrations-utils/connector';

export const up = async () => {
  const db = await getDb();
  /*
      Code your update script here!
   */
  await db
    .collection('notifications')
    .updateMany({}, { $set: { viewed: false } });
};

export const down = async () => {
  const db = await getDb();
  /*
      Code you downgrade script here!
   */
};
