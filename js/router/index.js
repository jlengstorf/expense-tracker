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
 * ## Route Definition
 */
const Router = {

  home() {
    dispatch({
      type: 'nav/change-view',
      view: 'home',
    });
  },

  test() {
    dispatch({
      type: 'nav/change-view',
      view: 'test',
    });
  },

};

const routeConfig = {
  target: Router,
  '/': 'home',
  '/home': 'home',
  '/test': 'test',
};

export default Router;
export {routeConfig};
