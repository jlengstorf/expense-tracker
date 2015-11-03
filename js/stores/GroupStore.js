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
import Group from '../models/GroupModel';

// types
type State = Map<string, Group>;

// debugger
const log = debug('store/GroupStore');

class GroupStore extends ReduceStore<string, Group> {

  getInitialState(): Map {
    return Map();
  }

  reduce(state: State, action: Action): State {
    switch (action.type) {
      case 'app/initialize':
        state = getGroupData(state);
        break;

      default:
        log(`No handler for action "${action.type}"`);
    }

    return state;
  }

}

log('TODO: move group data to a database/localStorage');
const tempGroups = [
  {
    id: '1636969f-58a9-4210-915b-74999150ecbf',
    name: 'J+M Worldwide',
    owner: '0ba081f6-9261-4c16-8476-9049165a7f04',
    members: [
      '0ba081f6-9261-4c16-8476-9049165a7f04',
      '6db0719a-603d-4986-8366-5bb6824ef9c2',
    ],
  },
  {
    id: '4566969f-58a9-4a10-915b-74999150e123',
    name: 'Things That Are Not Mine',
    owner: '0ba081f6-9261-4c16-8476-9049165a7123',
    members: [
      '0ba081f6-9261-4c16-8476-9049165a7123',
      '6db0719a-603d-4986-8366-5bb6824ef456',
    ],
  },
];

function getGroupData(state) {
  return bootstrap(tempGroups, Group);
}

const instance = new GroupStore(Dispatcher);
export default instance;
