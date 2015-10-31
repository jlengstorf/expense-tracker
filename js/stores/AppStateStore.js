/* @flow */
'use strict';

// libs
import {Map} from 'immutable';
import {ReduceStore} from 'flux/utils';
import debug from 'debug';

import type Immutable from 'immutable';

// flux infrastructure
import type Action from '../actions';
import Dispatcher from '../dispatcher';

// helpers
import {reset} from '../helpers/data';

// types
type State = Immutable.Map<string, boolean>;

// debugger
const log = debug('store/AppStateStore');

class AppStateStore extends ReduceStore<string, boolean> {

  getInitialState(): State {
    return Map({
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

const instance = new AppStateStore(Dispatcher);
export default instance;
