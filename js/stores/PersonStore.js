'use strict';

// libs
import {Map, List} from 'immutable';
import {ReduceStore} from 'flux/utils';
import debug from 'debug';

import type Immutable from 'immutable';

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

  getInitialState(): Map {
    return Map();
  }

  reduce(state: State, action: Action): State {
    switch (action.type) {
      case 'app/initialize':
        state = getPersonData(state);
        break;

      case 'user/register-or-login':
        state = registerOrLogin(state, action.data);
        break;

      default:
        log(`No handler for action "${action.type}"`);
    }

    return state;
  }

}

function registerOrLogin(state, data) {

  log('registerOrLogin()');

  // checks for an existing user and does nothing if the user exists
  if (state.find(user => user.email === data.email)) {
    log('user already exists!');
    return state;
  }

  // if the user doesn't exist, checks for required data and creates one
  if (!!data.first_name && !!data.last_name && !!data.name && !!data.email) {
    log('user does not exist; creating');
    const person = new Person(data);
    return state.set(person.id, person);
  }

  // if we get here, something went wrong
  log('something went wrong in registerOrLogin()');
  log(state);
  log(data);
}

// TODO Move this to a database
const tempPeople = [
  {
    id: '0ba081f6-9261-4c16-8476-9049165a7f04',
    first_name: 'Jason',
    last_name: 'Lengstorf',
    name: 'Jason Lengstorf',
    email: 'jason@lengstorf.com',
  },
  {
    id: '6db0719a-603d-4986-8366-5bb6824ef9c2',
    first_name: 'Marisa',
    last_name: 'Morby',
    name: 'Marisa Morby',
    email: 'me@marisamorby.com',
  },
];

function getPersonData(state) {
  return bootstrap(tempPeople, Person);
}

const instance = new PersonStore(Dispatcher);
export default instance;
