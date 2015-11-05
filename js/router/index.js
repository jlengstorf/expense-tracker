/*
 * # Router
 * Using `ampersand-router`, we'll manage what shows based on the current URI.
 *
 * @flow
 */

/*
 * ## Dependencies
 */

// libs
import React from 'react';
import ReactDOM from 'react-dom';
import debug from 'debug';

// dispatcher
import {dispatch} from '../dispatcher';

// debugger
const log = debug('router');

/*
 * ## Route Handler
 */
const Router = {

  home() {
    updateView('home');
  },

  test() {
    updateView('test');
  },

  testWithParams(request) {
    log(request);
    updateView('test', request.params);
  },

};

/*
 * ## Route Configuration
 */
const routeConfig = {
  target: Router,
  '/': 'home',
  '/home': 'home',
  '/test': {
    '/': 'test',
    '/:id': 'testWithParams',
  },
};

/*
 * ## Helper Functions
 */
function updateView(view: string, params: Object = {}): void {
  dispatch({
    type: 'nav/change-view',
    view: view,
    params: params,
  });
}

export default Router;
export {routeConfig};
