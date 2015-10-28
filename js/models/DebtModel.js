'use strict';

// libs
import uuid from 'uuid';
import {Record} from 'immutable';

const DebtRecord = Record({
  id: undefined,
  debtorID: undefined,
  lenderID: undefined,
  amount: undefined,
});

export default class Debt extends DebtRecord {
  id: string;
  debtorID: string;
  lenderID: string;
  amount: number;

  constructor(debt: object) {
    super({
      id: uuid.v4(),
      debtorID: debt.debtorID,
      lenderID: debt.lenderID,
      amount: debt.amount,
    });
  }
}
