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
import Dispatcher, {dispatch} from '../dispatcher';

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
      oauth: {
        showLogin: false,
        loading: false,
        network: false,
        user: false,
      },
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
        state = state.setIn(['oauth', 'showLogin'], true);
        break;

      case 'app/hide-login':
        state = state.setIn(['oauth', 'showLogin'], false);
        break;

      case 'user/oauth-pending':
        state = state.setIn(['oauth', 'loading'], true);
        break;

      case 'user/oauth-succeeded':
        this.getDispatcher().waitFor([
          PersonStore.getDispatchToken(),
        ]);

        // keeps a record of which network was used to log in (for logout)
        state = state.setIn(['oauth', 'network'], action.network);
        state = state.setIn(['oauth', 'showLogin'], false);
        state = state.setIn(['oauth', 'loading'], false);
        break;

      case 'user/data-loaded':
        this.getDispatcher().waitFor([
          PersonStore.getDispatchToken(),
        ]);

        try {

          // stores the logged in user in the state
          state = setLoggedInUser(state, action.data);
          log(state);
        } catch (error) {
          log('error logging in');
          log(error);

          // goes back to a clean slate if anything goes wrong
          // TODO make sure a full reset is necessary
          // TODO add a helpful error message of some sort
          state = reset();
        }

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

  log('setLoggedInUser()');

  // checks if the logged in user is in the PersonStore
  const person = PersonStore.getState().find(user => user.email === data.email);
  if (person) {
    return state.setIn(['oauth', 'user'], person);
  } else {
    log('invalid user data');
    log(data);
    throw Error('The supplied user data is invalid.');
  }
}

const instance = new AppStateStore(Dispatcher);
export default instance;
