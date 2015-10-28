'use strict';

// libs
import {Map, List} from 'immutable';
import {ReduceStore} from 'flux/utils';
import debug from 'debug';

// flux infrastructure
import type Action from '../actions';
import Dispatcher from '../dispatcher';

// helpers
import {bootstrap} from '../helpers/data';

// models
import Person from '../models/PersonModel';

// stores
import ExpenseStore from './ExpenseStore';

// types
type State = Immutable.Map<string, Person>;

// debugger
const log = debug('store/PersonStore');

class PersonStore extends ReduceStore<string, Person> {

  getInitialState(): State {
    return Map();
  }

  reduce(state: State, action: Action): State {
    switch (action.type) {
      case 'app/initialize':
        state = getPersonData(state);
        break;

      default:
        log(`No handler for action "${action.type}"`);
    }

    return state;
  }

}

// TODO Move this to a database
const tempPeople = [
  {
    id: '0ba081f6-9261-4c16-8476-9049165a7f04',
    fname: 'Jason',
    lname: 'Lengstorf',
  },
  {
    id: '6db0719a-603d-4986-8366-5bb6824ef9c2',
    fname: 'Marisa',
    lname: 'Morby',
  },
];

function getPersonData(state) {
  return bootstrap(tempPeople, Person);
}

const instance = new PersonStore(Dispatcher);
export default instance;
