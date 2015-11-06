/*
 * # PersonStore.js
 * Stores immutable Person records as an immutable Map.
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
import Person from '../models/PersonModel';

// stores
import ExpenseStore from './ExpenseStore';

// types
import type Immutable from 'immutable';
type State = Immutable.Map<string, Person>;

// debugger
const log = debug('store/PersonStore');

/*
 * ## Class Definition
 */
class PersonStore extends MapStore<string, Person> {

  reduce(state: State, action: Action): State {
    switch (action.type) {

      /*
       * ### Step 1. Look up the user data after login
       * Once a user clicks a login button to authorize the app to access their
       * data from an OAuth provider, we'll get back a data object with their
       * info — most importantly, their email address.
       *
       * The email address is used to search the database. If no match is found,
       * the user doesn't exist, and we move on to step 2.
       *
       * If the user's email _is_ in the database, then we skip ahead to step 3.
       */
      case 'user/oauth-succeeded':
        state = getPersonByEmail(state, action.data);
        break;

      /*
       * ### Step 2. Save new users to the database
       * When a new user logs in, their data needs to be stored in the database
       * for later use. We do this by tracking their email address as a unique
       * identifier, which allows us to use any OAuth service (assuming it's
       * the same email used for each) to log in.
       *
       * This function is a promise that, when resolved, triggers step 3.
       */
      case 'user/not-registered':
        state = savePersonToDB(state, action.data);
        break;

      /*
       * ### Step 3. Store the user in the state
       * After a successful login, whether it's a new user or not, the user's
       * information needs to be stored in the state.
       *
       * This is the action that tells the rest of the app that we're ready to
       * continue with loading other data.
       */
      case 'user/data-loaded':
        try {
          state = savePersonToState(state, action.data);
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
 * ### getPersonByEmail()
 * Loads a person from state or via the API
 *
 * @param  {State} state    the store's State
 * @param  {Object} person  data about the person from the OAuth provider
 * @return {State}          the modified (or not) State
 */
function getPersonByEmail(state: State, person: Object): State {

  log('getPersonByEmail()');
  log(person);

  /*
   * Defines the dispatch in a wrapper because it's called in two different
   * places below.
   */
  const onSuccess = (data) => {
    dispatch({
      type: 'user/data-loaded',
      data: data,
    });
  };

  // Starts by checking for a valid person in the state
  const fromState = state.find(user => user.email === person.email);
  if (fromState) {
    log('Person is already stored in the state');

    /*
     * If the person is already in the state, trigger the dispatch. It's
     * wrapped in `setTimeout` to make sure the dispatch is actually triggered.
     */
    window.setTimeout(onSuccess, 0, fromState);
  } else {
    log('Loading the person from the server.');

    /*
     * If the person isn't stored in the state, attempt to load user data from
     * the API by email. The `get()` function returns a `Promise` that resolves
     * with the response from the API request, which should be the user data,
     * or an empty array if the user doesn't exist.
     *
     * @see ../helpers/xhr.js
     */
    get('/people', {email: person.email})
      .then(JSON.parse)
      .then(response => {

        if (!!response[0]) {
          log('The person has an existing account.');

          // If a valid response comes back, dispatch that shit
          onSuccess(response[0]);
        } else {
          log('No account found.');

          // If no response come back, we don't know this user yet
          dispatch({
            type: 'user/not-registered',
            data: person,
          });
        }
      });
  }

  // Return state even if the user isn't loaded to avoid an invariant violation
  return state;
}

/**
 * ### savePersonToState()
 * Stores a new record (or updates an existing one) in the State.
 *
 * @param  {State}  state the store's state
 * @param  {Object} data  info for a Person record
 * @return {State}        the modified state
 */
function savePersonToState(state: State, data: Object): State {
  if (!!data.email && !!data.first_name && !!data.last_name && !!data.id) {

    // If required data is there, creates a new Person record and stores it.
    const person = new Person(data);
    return state.set(person.id, person);
  } else {

    // There should be no way to ever get to this error, but just in case...
    throw Error('Invalid person data supplied.');
  }
}

/**
 * ### savePersonToDB()
 * Sends a user's data to an API endpoint for persistent storage.
 *
 * @param  {State}  state the store's state
 * @param  {Object} data  info for a Person record
 * @return {State}        the unmodified state
 */
function savePersonToDB(state: State, data: Object): State {

  // only does something if the user isn't already stored in the state
  if (!state.find(user => user.email === data.email)) {
    log('user is not in state; saving');

    /*
     * We only want to store a new user record if there's not already a record
     * in the state.
     *
     * To make sure our data is well-formed, we'll create a Person record, then
     * convert it to a JS object to be sent as the PUT request payload.
     *
     * The request is made using the `put()` helper function.
     *
     * @see ../helpers/xhr.js
     */
    const person = new Person(data);
    put('/people', person.toJSON())
      .then(response => {
        log(response);

        // Once the user is saved, dispatch the data to continue
        dispatch({
          type: 'user/data-loaded',
          data: person.toJSON(),
        });
      });
  }

  /*
   * Because this is an async operation, just return the state as-is. It will
   * be modified later, when the `user/data-loaded `action is dispatched.
   */
  return state;
}

/*
 * Exports as a singleton to make sure dispatch tokens work properly.
 */
const instance = new PersonStore(Dispatcher);
export default instance;
