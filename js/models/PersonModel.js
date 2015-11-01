'use strict';

// libs
import uuid from 'uuid';
import {Record} from 'immutable';

const PersonRecord = Record({
  id: undefined,
  first_name: undefined,
  last_name: undefined,
  name: undefined,
  email: undefined,
});

export default class Person extends PersonRecord {
  id: string;
  first_name: string;
  last_name: string;
  name: string;
  email: string;

  constructor(person: object) {
    super({

      // id: uuid.v4(),
      id: person.id,
      first_name: person.first_name,
      last_name: person.last_name,
      name: person.name,
      email: person.email,
    });
  }
}
