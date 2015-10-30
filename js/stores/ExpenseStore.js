'use strict';

// libs
import {Map} from 'immutable';
import {ReduceStore} from 'flux/utils';
import moment from 'moment';
import debug from 'debug';

// flux infrastructure
import type Action from '../actions';
import Dispatcher from '../dispatcher';

// helpers
import {bootstrap} from '../helpers/data';

// models
import Expense from '../models/ExpenseModel';

// types
type State = Map;

// debugger
const log = debug('store/ExpenseStore');

class ExpenseStore extends ReduceStore<string, Expense> {

  getInitialState(): Map {
    return Map();
  }

  reduce(state: State, action: Action): State {
    switch (action.type) {
      case 'app/initialize':
        state = getExpenseData(state);
        break;

      case 'expense/create':
        const expense = new Expense(action.expense);
        log(`New expense ${expense.id} added.`);
        state = state.set(expense.id, expense);

        state.forEach(log);
        break;

      case 'expense/update':
        state = state.set(action.id, action.expense);
        break;

      case 'expense/delete':
        state = state.delete(action.id);
        break;

      default:
        log(`No handler for action "${action.type}"`);

    }

    // Sorts to keep expenses in reverse chronological order for now
    // TODO add different sorting options
    return state.sortBy(expense => expense.date, (a, b) => a < b);
  }

}

log('TODO: Move expense data to a database/localStorage');
const tempExpenses = [
  {
    date: +moment('2015-10-25T11:10:31+07:00'),
    vendor: 'Delta Airlines',
    amount: 800.00,
    categoryID: '95c1b56d-c585-4f24-ad4c-f3310a3eca2a',
    personID: '6db0719a-603d-4986-8366-5bb6824ef9c2',
  },
  {
    date: +moment('2015-10-25T08:02:17+07:00'),
    vendor: 'Bondi Cafe',
    amount: 8.00,
    categoryID: '5601dfda-610a-4762-85de-e51e1b9d5a10',
    personID: '0ba081f6-9261-4c16-8476-9049165a7f04',
  },
  {
    date: +moment('2015-10-25T07:57:59+07:00'),
    vendor: 'Coconut Beach',
    amount: 700.00,
    categoryID: '782eade6-0386-42ba-b910-de4bd209ed90',
    personID: '0ba081f6-9261-4c16-8476-9049165a7f04',
  },
  {
    date: +moment('2015-10-24T21:42:13+07:00'),
    vendor: 'Buri Resort',
    amount: 400.00,
    categoryID: '782eade6-0386-42ba-b910-de4bd209ed90',
    personID: '0ba081f6-9261-4c16-8476-9049165a7f04',
  },
];

function getExpenseData(state) {
  return bootstrap(tempExpenses, Expense);
}

const instance = new ExpenseStore(Dispatcher);
export default instance;
