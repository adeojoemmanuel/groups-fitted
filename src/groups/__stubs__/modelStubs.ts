import { outfitBuyerStub } from '../../users/__stubs__/modelStubs';
import { Event } from '../models/event.model';
import { Group } from '../models/group.model';
export const groupStub = (): Group => {
  // const group = {
  //     "members": [
  //         "6115454d5824ed9efe8d2213"
  //     ],
  //     "admins": [
  //         "6115454d5824ed9efe8d2213"
  //     ],
  //     "id": "6115454d5824ed9efe8d2219",
  //     "gender": "male",
  //     "initiator": "6115454d5824ed9efe8d2213",
  //     "event": "6115454d5824ed9efe8d2215",
  //     "createdAt": "2021-08-12T15:59:09.501Z",
  //     "updatedAt": "2021-08-12T15:59:09.501Z",
  // }

  const group = {
    members: [outfitBuyerStub()],
    admins: [outfitBuyerStub()],
    id: '6115454d5824ed9efe8d2219',
    gender: 'male',
    name: 'Default Group Name',
    initiator: outfitBuyerStub(),
    event: eventStub(),
    createdAt: '2021-08-12T15:59:09.501Z',
    updatedAt: '2021-08-12T15:59:09.501Z',
  };

  return group; // new Group(group);
};

export const eventStub = (): Event => {
  const event = {
    images: [],
    imagesMetadata: {},
    id: '6115473d7a9e149ff1a2d445',
    name: 'Big24',
    date: new Date('2021-05-07T23:00:00.000Z'),
    type: 'birthday',
    role: 'Celebrant',
    link: 'big24-b6f811',
    creator: '6115473d7a9e149ff1a2d443',
    admins: [outfitBuyerStub()],
    createdAt: '2021-08-12T16:07:25.645Z',
    updatedAt: '2021-08-12T16:07:25.645Z',
  };
  return event;
};
