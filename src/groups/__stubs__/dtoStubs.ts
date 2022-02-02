import * as moment from 'moment';
import * as mongoose from 'mongoose';
import { config } from '../../config';
import { outfitBuyerSignupDtoSub } from '../../users/__stubs__/dtoStubs';
import { Gender } from '../../utils/enums/gender.enum';
import { AddRecipientDto } from '../dto/add-recipient.dto';
import { CreateEventAndSignupDto } from '../dto/create-event-signup.dto';
import { CreateEventDto } from '../dto/create-event.dto';
import { CreateGroupDto } from '../dto/create-group.dto';
import { EventRole } from '../models/event-role.enum';
import { EventType } from '../models/event-type.enum';

export const createEventAndSignupDtoStub = (): CreateEventAndSignupDto => {
  const event = {
    name: `John Doe's party`,
    type: EventType.Birthday,
    role: EventRole.Celebrant,
    date: moment()
      .add(config.minEventStartDate + 1, 'days')
      .toDate(),
    gender: Gender.Male,
    outfitBuyer: outfitBuyerSignupDtoSub(),
  };
  return new CreateEventAndSignupDto(event);
};

export const createEventDtoStub = (): CreateEventDto => {
  const event = {
    name: `John Doe's party`,
    type: EventType.Birthday,
    role: EventRole.Celebrant,
    date: moment()
      .add(config.minEventStartDate + 1, 'days')
      .toDate(),
    gender: Gender.Male,
  };
  return new CreateEventDto(event);
};

export const createGroupDtoStub = (): CreateGroupDto => {
  const group = {
    eventId: mongoose.Types.ObjectId().toString(),
    gender: Gender.Male,
  };
  return new CreateGroupDto(group);
};

export const addRecipientDtoStub = (): AddRecipientDto => {
  const recipient = {
    groupId: '610102baa1af2494557058ab',
    firstName: 'Nodup3',
    lastName: 'Nodupli3',
    phoneNumber: '+2347066667777',
    email: 'nodup4Location@gmail.com',
    location: 'Okokomaiko, OKM',
    smsInvite: true,
    emailInvite: true,
    useInitiatorTailor: true,
    canChooseTailor: true,
    useInitiatorMeasurementToken: true,
  };
  return new AddRecipientDto(recipient);
};
