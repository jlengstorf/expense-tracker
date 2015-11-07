'use strict';

// libs
import uuid from 'uuid';
import slug from 'slug';
import {Record} from 'immutable';

const GroupRecord = Record({
  id: undefined,
  name: undefined,
  slug: undefined,
  owner: undefined,
  members: undefined,
});

export default class Group extends GroupRecord {
  id: string;
  name: number;
  slug: number;
  owner: string;
  members: array;

  constructor(group: object) {
    super({
      id: group.id || uuid.v4(),
      name: group.name,
      slug: slug(group.name, {lower: true}),
      owner: group.owner,
      members: group.members,
    });
  }
}
