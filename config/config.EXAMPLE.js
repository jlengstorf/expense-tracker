/**
 * # Config Example
 * This config file is a sample to be used for the app's real config files.
 *
 * Create a copy and name it with the environment for which the data is
 * intended (e.g. `development.js` or `production.js`).
 *
 * To access this config data, you can include this module using `require` or
 * `import`.
 *
 *     // using require
 *     var config = require('config');
 *
 *     // using import
 *     import config from 'config';
 *
 * When webpack compiles the bundle, it will replace "config" with the file
 * that matches the environment. For details, see `webpack.config.js` and
 * check out the `replaceConfig` declaration.
 */
'use strict';

export default {

  /*
   * ## Social Login/Registration
   * This app uses hello.js to manage OAuth logins.
   * @see https://adodson.com/hello.js/
   */
  auth: {

    /*
     * ### Facebook
     * Create a new Facebook app in the Facebook Developers console.
     *
     * @see https://developers.facebook.com/apps/
     */
    FACEBOOK_APP_ID: 'YOUR_FACEBOOK_APP_ID_HERE',

    /*
     * ### Google
     * Create a new app in the Google Developer Console.
     *
     * NOTE: Make sure the Google+ API is enabled or OAuth doesn't work.
     *
     * @see https://console.developers.google.com/
     */
    GOOGLE_APP_ID: 'YOUR_GOOGLE_APP_ID_HERE',

    /*
     * ### Twitter
     * Create a new app in the Twitter app console.
     *
     * NOTE: By default, Twitter doesn't expose emails. Make sure to request
     * elevated permissions for your app via Twitter Support.
     *
     * @see https://apps.twitter.com
     * @see https://support.twitter.com/forms/platform
     */
    TWITTER_APP_ID: '5NsS27lIYLwT2Hf4ZcL7VdPfU',
  },
};
