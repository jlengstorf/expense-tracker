'use strict';

import type {Action} from './TodoActions';

import {Dispatcher} from 'flux';
import debug from 'debug';

const log = debug('dispatcher');

const instance: Dispatcher<Action> = new Dispatcher();
export default instance;

// So we can conveniently do, `import {dispatch} from './TodoDispatcher';`
function dispatchWrapper(action) {
  log(`action: ${action.type}`);

  this.dispatch(action);
}

export const dispatch = dispatchWrapper.bind(instance);
