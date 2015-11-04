/* @flow */
'use strict';

// config
import config from 'config';

export default {

  /**
   * XHR wrapper for PUT requests
   * @param  {String} uri  the API endpoint
   * @param  {Object} body request payload (runs through JSON.stringify())
   * @return {Promise}     Promise resolved with response or rejected w/error
   */
  put: (uri, body) => {
    return _xhr('PUT', uri, body);
  },

  /**
   * XHR wrapper for GET requests
   * @param  {String} uri the API endpoint
   * @return {Promise}    Promise resolved with response or rejected w/error
   */
  get: (uri, params) => {
    return _xhr('GET', uri, params);
  },

};

/*
 * ## Pure Helper Functions
 * Stateless functions to handle data manipulation.
 */

/*
 * XHR wrapper to handle various HTTP requests
 */
function _xhr(method: string, uri: string, data: Object<K, V>): Promise {

  // Determines if a query string or JSON payload is required
  let payload = undefined;
  let params = false;
  switch (method) {

    case 'GET':
      params = queryStringify(data);
      break;

    case 'PUT':
      payload = JSON.stringify(data);
      break;

    default:

  }

  const apiUri = config.api.uri + uri + (!!params ? `?${params}` : '');

  return new Promise((resolve, reject) => {

    // Bails if both parameters and payload aren't set
    if (!!payload && !!params) {
      reject(Error('No payload or parameters set.'));
    }

    // Opens the request (CORS-friendly)
    const req = new XMLHttpRequest();
    req.open(method, apiUri, true);

    // If we get a 200 OK back, resolves with the response, otherwise rejects
    req.onload = () => {
      if (req.status === 200) {
        resolve(req.response);
      } else {
        reject(Error(req.statusText));
      }
    };

    // If something goes wrong with the connection, reject with an error
    req.onerror = () => {
      reject(Error('Network error'));
    };

    // Sends the request (with a payload, if one is set)
    req.send(payload);
  });
}

/*
 * ### queryStringify()
 * Utility to create a query string from an object of key=>value pairs. Note
 * that this function does NOT prepend a question mark to the query string.
 *
 * Example:
 *
 *     const params = {
 *       email: 'me@example.org',
 *       name: 'John Doe',
 *     };
 *
 *     queryStringify(params); // => email=me%40example.org&name=John%20Doe
 *
 * Because sending anything beyond a few simple parameters in the query string
 * feels silly, this function does not handle nested objects.
 *
 * @params {Object} params<K, V>  key=>value object of parameters to convert
 * @return {String}               the query string
 * @private
 */
function queryStringify(params: object<K, V>): string {
  return Object.keys(params).map(key => {
    return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
  }).join('&');
}
