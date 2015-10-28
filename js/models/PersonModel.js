'use strict';

// libs
import uuid from 'uuid';
import {Record} from 'immutable';

const PersonRecord = Record({
  id: undefined,
  fname: undefined,
  lname: undefined,
});

export default class Person extends PersonRecord {
  id: string;
  fname: string;
  lname: string;

  constructor(person: object) {
    super({

      // id: uuid.v4(),
      id: person.id,
      fname: person.fname,
      lname: person.lname,
    });
  }
}
