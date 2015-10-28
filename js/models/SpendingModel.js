'use strict';

// libs
import uuid from 'uuid';
import {Record} from 'immutable';

const SpendingRecord = Record({
  id: undefined,
  personID: undefined,
  expected: undefined,
  actual: undefined,
});

export default class Spending extends SpendingRecord {
  id: string;
  personID: string;
  expected: number;
  actual: number;

  constructor(debt: object) {
    super({
      id: uuid.v4(),
      personID: debt.personID,
      expected: debt.expected,
      actual: debt.actual,
    });
  }
}
