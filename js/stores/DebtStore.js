'use strict';

// libs
import {Map, List} from 'immutable';
import {ReduceStore} from 'flux/utils';
import debug from 'debug';

// flux infrastructure
import type Action from '../actions';
import Dispatcher from '../dispatcher';

// helpers
import {toNearestCent} from '../helpers/math';

// models
import Debt from '../models/DebtModel';

// stores
import ExpenseStore from './ExpenseStore';
import PersonStore from './PersonStore';
import SpendingStore from './SpendingStore';

// types
type State = Immutable.Map<string, Debt>;

// debugger
const log = debug('store/DebtStore');

class DebtStore extends ReduceStore<string, Debt> {

  getInitialState(): State {
    return Map();
  }

  reduce(state: State, action: Action): State {
    switch (action.type) {
      case 'app/initialize':
      case 'expense/create':
        this.getDispatcher().waitFor([
          ExpenseStore.getDispatchToken(),
          PersonStore.getDispatchToken(),
          SpendingStore.getDispatchToken(),
        ]);

        state = getDebts(state);
        break;

      default:
        log(`No handler for action "${action.type}"`);
    }

    return state;
  }

}

function getDebts(state: State): State {
  log('getDebts()');

  const {owed, owes} = getBalances();

  log('owed'); log(owed);
  log('owes'); log(owes);

  // Determines who owes money to whom, and how much
  let debts = [];
  Object.keys(owes).forEach(debtorID => {
    const balance = owes[debtorID];
    let outstanding = balance * -1;

    log(`outstanding balance is ${outstanding}`);

    Object.keys(owed).forEach(lenderID => {
      const owedAmount = owed[lenderID];

      // TODO Figure out why this isn't updating past a certain point
      if (owedAmount <= outstanding) {
        debts[debtorID + lenderID] = {
          debtorID: debtorID,
          lenderID: lenderID,
          amount: toNearestCent(owedAmount),
        };

        outstanding -= owedAmount;
        log(`new outstanding balance is ${outstanding}`);
      }
    });
  });

  log(debts);

  let newState = Map();
  Object.keys(debts).forEach(debtID => {
    const debt = new Debt(debts[debtID]);
    log(debt);
    newState = newState.set(debt.id, debt);
  });

  log('returns =>');
  log(newState);

  return newState;
}

function getBalances(): object {
  log('getBalances()');

  const totals = SpendingStore.getState();
  let balances = {
    owed: [],
    owes: [],
  };

  totals.forEach(total => {
    const balance = toNearestCent(total.actual - total.expected);

    if (balance < 1) {
      balances.owes[total.personID] = balance;
    } else {
      balances.owed[total.personID] = balance;
    }
  });

  log('returns =>');
  log(balances);

  return balances;
}

const instance = new DebtStore(Dispatcher);
export default instance;
