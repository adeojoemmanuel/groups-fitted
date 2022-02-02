import { getDb } from '../migrations-utils/connector';

export const up = async () => {
  const db = await getDb();
  /*
      Code your update script here!
   */
  const groups = await db.collection('groups').find().toArray();
  for (const group of groups) {
    const outfitBuyer = await db
      .collection('outfitbuyers')
      .findOne({ _id: group.initiator });
    const user = await db
      .collection('useraccounts')
      .findOne({ _id: outfitBuyer.userAccount });
    const newGroupName = `${user.firstName} ${user.lastName}`;
    //  group.name = newGroupName;
    //  await group.save();
    await db
      .collection('groups')
      .findOneAndUpdate({ _id: group._id }, { $set: { name: newGroupName } });
  }
};

export const down = async () => {
  const db = await getDb();
  /*
      Code you downgrade script here!
   */
};
