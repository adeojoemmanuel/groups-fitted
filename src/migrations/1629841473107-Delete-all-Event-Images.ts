import { getDb } from '../migrations-utils/connector';

export const up = async () => {
  const db = await getDb();
  /*
      Code your update script here!
   */
  await db.collection('events').updateMany(
    {},
    {
      $set: {
        images: [],
        imagesMetadata: {},
      },
    },
  );
};

export const down = async () => {
  const db = await getDb();
  /*
      Code you downgrade script here!
   */
};
