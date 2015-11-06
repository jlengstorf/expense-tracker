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
 * For details about route handling, see the Aviator docs.
 *
 * @see https://github.com/swipely/aviator
 */
const Router = {

  /**
   * ### Router.viewChange()
   * Determines the view name, then reqeusts a dispatch.
   *
   * @param  {Request} request  the Request object from `Aviator.navigate()`
   * @return {void}
   */
  viewChange(request: Object<Request>): void {
    const view = getViewNameFromURI(request.uri);

    dispatchViewChange(view);
  },

  /**
   * ### Router.groupViewChange()
   * Group URIs are set up differently, so the handler needs tweaking.
   *
   * @param  {Request} request  the Request object from `Aviator.navigate()`
   * @return {void}
   */
  groupViewChange(request: Object<Request>): void {
    const view = getViewNameFromGroupURI(request.uri);

    dispatchViewChange(view, request.params);
  },

  /**
   * ### Router.notFound()
   * This method is called whenever a handler hasn't been specified for a URI.
   *
   * @return {void}
   */
  notFound() {
    dispatchViewChange('404');
  },

};

/*
 * ## Route Configuration
 * For details about how routes are configured, see the Aviator docs.
 *
 * @see https://github.com/swipely/aviator
 */
const routeConfig = {

  // Specifies which object has the methods specified for each route.
  target: Router,

  // Top-level routes are pretty straightforward and don't have params.
  '/': 'viewChange',
  '/home': 'viewChange',
  '/login': 'viewChange',
  '/account': 'viewChange',
  '/groups': 'viewChange',

  // Group routes start with the group ID, then specify which view to show.
  '/:group_id': {
    '/expenses': 'groupViewChange',
    '/categories': 'groupViewChange',
    '/settings': 'groupViewChange',
  },
  notFound: 'notFound',
};

/*
 * ## Helper Functions
 */

/**
 * ### dispatchViewChange()
 * Sends a Flux dispatch with information about the requested view.
 *
 * @param  {String} view    the name of the requested view
 * @param  {Object} params  optional parameters from the URI
 * @return {void}
 */
function dispatchViewChange(view: string, params: ?Object = {}): void {
  dispatch({
    type: 'nav/change-view',
    view: view,
    params: params,
  });
}

/**
 * ### getViewNameFromURI()
 * Pulls the view name out of the URI to be dispatched to the app.
 *
 * @param  {String} uri the URI requested
 * @return {String}     the name of the view to be dispatched
 */
function getViewNameFromURI(uri: string): string {
  const uriParts = uri.split('/');

  // We need to make sure we're always returning a view.
  return !!uriParts[1] ? uriParts[1] : 'home';
}

/**
 * ### getViewNameFromGroupURI()
 * Group URIs start with a group ID, so `getViewNameFromURI()` doesn't work
 * properly in this case.
 *
 *     /:group_id/[VIEW]
 *
 * @param  {String} uri the URI requested
 * @return {String}     the name of the view to be dispatched
 */
function getViewNameFromGroupURI(uri: string): string {
  const uriParts = uri.split('/');

  // The view name comes after the group ID in group URIs.
  return uriParts[2];
}

export default Router;
export {routeConfig};
