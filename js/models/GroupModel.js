'use strict';

// libs
import uuid from 'uuid';
import {Record} from 'immutable';

const GroupRecord = Record({
  id: undefined,
  name: undefined,
  owner: undefined,
  members: undefined,
});

export default class Group extends GroupRecord {
  id: string;
  name: number;
  owner: string;
  members: array;

  constructor(group: object) {
    super({

      // id: uuid.v4(),
      id: group.id,
      name: group.name,
      owner: group.owner,
      members: group.members,
    });
  }
}
