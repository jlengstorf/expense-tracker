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
import Category from '../models/CategoryModel';

// types
type State = Immutable.Map<string, Category>;

// debugger
const log = debug('store/CategoryStore');

class CategoryStore extends ReduceStore<string, Category> {

  getInitialState(): State {
    return Map();
  }

  reduce(state: State, action: Action): State {
    switch (action.type) {
      case 'app/initialize':
        state = getCategoryData(state);
        break;

      default:
        log(`No handler for action "${action.type}"`);
    }

    return state;
  }

}

log('TODO: move category data to a database/localStorage');
const tempCategories = [
  {
    id: '95c1b56d-c585-4f24-ad4c-f3310a3eca2a',
    name: 'Transportation',
    split: [
      {
        personID: '0ba081f6-9261-4c16-8476-9049165a7f04',
        percent: 50,
      },
      {
        personID: '6db0719a-603d-4986-8366-5bb6824ef9c2',
        percent: 50,
      },
    ],
  },
  {
    id: '5601dfda-610a-4762-85de-e51e1b9d5a10',
    name: 'Food',
    split: [
      {
        personID: '0ba081f6-9261-4c16-8476-9049165a7f04',
        percent: 70,
      },
      {
        personID: '6db0719a-603d-4986-8366-5bb6824ef9c2',
        percent: 30,
      },
    ],
  },
  {
    id: '782eade6-0386-42ba-b910-de4bd209ed90',
    name: 'Lodging',
    split: [
      {
        personID: '0ba081f6-9261-4c16-8476-9049165a7f04',
        percent: 70,
      },
      {
        personID: '6db0719a-603d-4986-8366-5bb6824ef9c2',
        percent: 30,
      },
    ],
  },
];

function getCategoryData(state) {
  return bootstrap(tempCategories, Category);
}

const instance = new CategoryStore(Dispatcher);
export default instance;
