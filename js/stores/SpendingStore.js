/* @flow */
'use strict';

// libs
import {Map} from 'immutable';
import {ReduceStore} from 'flux/utils';
import debug from 'debug';

// flux infrastructure
import type Action from '../actions';
import Dispatcher from '../dispatcher';

// helpers
import {reset} from '../helpers/data';

// models
import Spending from '../models/SpendingModel';

// stores
import ExpenseStore from './ExpenseStore';
import CategoryStore from './CategoryStore';
import PersonStore from './PersonStore';

// types
type State = Map<string, Spending>;

// debugger
const log = debug('store/SpendingStore');

class SpendingStore extends ReduceStore<string, Spending> {

  getInitialState(): Map {
    return Map();
  }

  reduce(state: State, action: Action): State {
    switch (action.type) {
      case 'app/initialize':
      case 'expense/create':
      case 'expense/update':
      case 'expense/delete':
        this.getDispatcher().waitFor([
          ExpenseStore.getDispatchToken(),
          CategoryStore.getDispatchToken(),
          PersonStore.getDispatchToken(),
        ]);

        state = reset();
        state = getSpending(state);
        break;

      default:
        log(`No handler for action "${action.type}"`);
    }

    return state;
  }

}

function getSpending(state) {
  const expenses = ExpenseStore.getState();
  const categories = CategoryStore.getState();
  const people = PersonStore.getState();

  people.forEach(person => {
    const data = {
      personID: person.id,
      expenses: expenses,
      categories: categories,
    };
    const spending = new Spending({
      personID: person.id,
      expected: getExpectedSpending(data),
      actual: getActualSpending(data),
    });

    log(`getSpending() => ${person.first_name} — expected: ${spending.expected} | actual: ${spending.actual}`);

    state = state.set(spending.id, spending);
  });

  return state;
}

function getActualSpending(data) {
  const {
    personID,
    expenses,
    categories,
  } = data;

  let actual = 0;
  expenses.forEach(expense => {
    if (expense.personID === personID) {
      actual += expense.amount;
    }
  });

  return actual;
}

function getExpectedSpending(data) {
  const {
    personID,
    expenses,
    categories,
  } = data;

  let expected = 0;
  expenses.forEach(expense => {
    const category = categories.get(expense.categoryID);

    // Grabs the split data and multiplies the amount accordingly
    category.get('split').forEach(split => {
      if (split.personID === personID) {
        expected += expense.amount * split.percent;
      }
    });
  });

  return expected;
}

const instance = new SpendingStore(Dispatcher);
export default instance;
