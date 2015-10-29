'use strict';

// libs
import uuid from 'uuid';
import {Record} from 'immutable';
import moment from 'moment';

import {toNearestCent} from '../helpers/math';

const ExpenseRecord = Record({
  id: undefined,
  date: undefined,
  vendor: undefined,
  amount: undefined,
  categoryID: undefined,
  personID: undefined,
});

export default class Expense extends ExpenseRecord {
  id: string;
  date: number;
  vendor: string;
  amount: number;
  categoryID: string;
  personID: string;

  constructor(expense: object) {
    super({
      id: uuid.v4(),
      date: +moment(expense.date),
      vendor: expense.vendor,
      amount: toNearestCent(expense.amount),
      categoryID: expense.categoryID,
      personID: expense.personID,
    });
  }
}
