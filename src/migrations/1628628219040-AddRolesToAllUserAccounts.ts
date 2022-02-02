import { Db } from 'mongodb';
import { getDb } from '../migrations-utils/connector';
import { userRoles } from '../users/models/roles.enum';

export const up = async () => {
  const db: Db = await getDb();
  /*
      Code your update script here!
   */
  await db
    .collection('useraccounts')
    .updateMany({}, { $set: { role: [userRoles.OutfitBuyer] } });
};

export const down = async () => {
  const db: Db = await getDb();
  /*
      Code you downgrade script here!
   */
};
