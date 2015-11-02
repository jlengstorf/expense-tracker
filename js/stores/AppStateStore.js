/* @flow */
'use strict';

// libs
import {Map} from 'immutable';
import {ReduceStore} from 'flux/utils';
import debug from 'debug';

// types
import type Immutable from 'immutable';

// flux infrastructure
import type Action from '../actions';
import Dispatcher from '../dispatcher';

// stores
import PersonStore from '../stores/PersonStore';

// helpers
import {reset} from '../helpers/data';

// types
type State = Immutable.Map<string, boolean>;

// debugger
const log = debug('store/AppStateStore');

class AppStateStore extends ReduceStore<string, boolean> {

  getInitialState(): State {
    return Map({
      isLoginVisible: false,
      isModalLoading: false,
      loggedInWith: false,
      user: false,
      isFormVisible: false,
      currentlyEditing: false,
      error: {
        type: false,
        message: false,
      },
    });
  }

  reduce(state: State, action: Action): State {
    switch (action.type) {
      case 'app/initialize':
        state = reset();
        break;

      case 'app/show-login':
        state = state.set('isLoginVisible', true);
        break;

      case 'app/hide-login':
        state = state.set('isLoginVisible', false);
        break;

      case 'user/register-or-login':
        this.getDispatcher().waitFor([
          PersonStore.getDispatchToken(),
        ]);
        state = reset();
        state = state.set('loggedInWith', action.network);
        state = setLoggedInUser(state, action.data);
        break;

      case 'user/logout':
        state = reset();
        break;

      case 'app/toggle-setting':
        state = state.set(action.setting, !state.get(action.setting));
        break;

      case 'app/update-setting':
        state = state.set(action.setting, action.value);
        break;

      default:
        log(`No handler for action "${action.type}"`);
    }

    return state;
  }

}

function setLoggedInUser(state, data) {
  const people = PersonStore.getState();
  const user = people.find(person => person.email === data.email);

  return state.set('user', user);
}

const instance = new AppStateStore(Dispatcher);
export default instance;
