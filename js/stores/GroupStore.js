/*
 * # GroupStore.js
 * Stores immutable Group records as an immutable Map.
 *
 * @flow
 */
'use strict';

/*
 * ## Dependencies
 */

// libs
import {Map, List} from 'immutable';
import {MapStore} from 'flux/utils';
import debug from 'debug';

// flux infrastructure
import type Action from '../actions';
import Dispatcher, {dispatch} from '../dispatcher';

// helpers
import {bootstrap} from '../helpers/data';
import {get, put} from '../helpers/xhr';

// models
import Group from '../models/GroupModel';

// stores
import AppStateStore from './AppStateStore';

// types
type State = Map<string, Group>;

// debugger
const log = debug('store/GroupStore');

/*
 * ## Class Definition
 */
class GroupStore extends MapStore<string, Group> {

  reduce(state: State, action: Action): State {
    switch (action.type) {

      /*
       * ### Step 1: Load the group after user data is loaded
       * After a user is successfully logged in, we need to load the groups
       * owned by that user.
       *
       * (We'll also need to load any groups to whom the user belongs, but is
       * NOT an owner — but that's a TODO for another day.)
       *
       * We wait for the AppState to handle the dispatch, then grab the userID
       * from its state and use that to look up the group(s) owned by the
       * logged in user.
       */
      case 'user/data-loaded':
        this.getDispatcher().waitFor([
          AppStateStore.getDispatchToken(),
        ]);

        // Grab the currently logged in user's ID from the AppState
        const userID = AppStateStore.getState().getIn(['oauth', 'user', 'id']);

        // Load the group(s) owned by that user
        state = getGroupByOwner(state, userID);
        break;

      /*
       * ### Step 2: Store the loaded group in the store state
       * After we have the group(s) loaded, we need to update the state so we
       * can access group data elsewhere in the app.
       *
       * This action is dispatched once the async calls in `getGroupByOwner()`
       * have completed.
       */
      case 'group/group-loaded':
        try {
          state = saveGroupToState(state, action.group);
        } catch (error) {
          log(error);
        }

        break;

      // No op for unhandled actions.
      default:
        log(`No handler for action "${action.type}"`);
    }

    return state;
  }

}

/*
 * ## Pure Helper Functions
 */

/**
 * ### getGroupByOwner()
 * Loads a group from state or via the API
 *
 * @param  {State} state    the store's State
 * @param  {Object} owner   user ID that owns groups to be loaded
 * @return {State}          the modified (or not) State
 */
function getGroupByOwner(state: State, ownerID: string): State {

  log('getGroupByOwner()');
  log(`ownerID: ${ownerID}`);

  /*
   * Defines the dispatch in a wrapper because it's called in two different
   * places below.
   */
  const onSuccess = (group) => {
    dispatch({
      type: 'group/group-loaded',
      group: group,
    });
  };

  // Starts by checking for a valid group in the state
  const fromState = state.find(g => g.owner === ownerID);
  if (fromState) {
    log('Group is already stored in the state');

    /*
     * If the group is already in the state, trigger the dispatch. It's
     * wrapped in `setTimeout` to make sure the dispatch is actually triggered.
     */
    window.setTimeout(onSuccess, 0, fromState);
  } else {
    log('Loading the group from the server.');

    /*
     * If the group isn't stored in the state, attempt to load group data from
     * the API by email. The `get()` function returns a `Promise` that resolves
     * with the response from the API request, which should be the group data,
     * or an empty array if the group doesn't exist.
     *
     * @see ../helpers/xhr.js
     */
    get('/groups', {owner: ownerID})
      .then(JSON.parse)
      .then(response => {

        if (!!response[0]) {
          log('Group found.');

          // If a valid response comes back, dispatch that shit
          onSuccess(response[0]);
        } else {
          log('No groups found.');

          // If no response come back, the user hasn't created a group yet
          dispatch({
            type: 'group/no-groups',
            data: ownerID,
          });
        }
      });
  }

  // Return state even if the user isn't loaded to avoid an invariant violation
  return state;
}

/**
 * ### saveGroupToState()
 * Stores a new record (or updates an existing one) in the State.
 *
 * @param  {State}  state the store's state
 * @param  {Object} data  info for a Group record
 * @return {State}        the modified state
 */
function saveGroupToState(state: State, group: Object): State {
  if (!!group.owner && !!group.members && !!group.id) {

    // If required group is there, creates a new Group record and stores it.
    const groupRecord = new Group(group);
    return state.set(groupRecord.id, groupRecord);
  } else {

    // There should be no way to ever get to this error, but just in case...
    throw Error('Invalid group data supplied.');
  }
}

/**
 * ### saveGroupToDB()
 * Sends a group's data to an API endpoint for persistent storage.
 *
 * @param  {State}  state the store's state
 * @param  {Object} data  info for a Group record
 * @return {State}        the unmodified state
 */
function saveGroupToDB(state: State, group: Object): State {

  // only does something if the group isn't already stored in the state
  if (!state.find(g => g.owner === group.owner)) {
    log('group is not in state; saving');

    /*
     * We only want to store a new group record if there's not already a record
     * in the state.
     *
     * To make sure our data is well-formed, we'll create a Group record, then
     * convert it to a JS object to be sent as the PUT request payload.
     *
     * The request is made using the `put()` helper function.
     *
     * @see ../helpers/xhr.js
     */
    const groupRecord = new Group(group);
    put('/groups', groupRecord.toJSON())
      .then(response => {
        log(response);

        // Once the group is saved, dispatch the data to continue
        dispatch({
          type: 'group/group-loaded',
          group: groupRecord.toJSON(),
        });
      });
  }

  /*
   * Because this is an async operation, just return the state as-is. It will
   * be modified later, when the `group/data-loaded `action is dispatched.
   */
  return state;
}

const instance = new GroupStore(Dispatcher);
export default instance;
