/*
 * # Login View
 * The layout component for the login page.
 *
 * @flow
 */
'use strict';

/*
 * ## Dependencies
 */

// libs
import React, {Component} from 'react';
import debug from 'debug';

// components
import Auth from '../Auth';

// debugger
const log = debug('View/Login');

/*
 * ## Component Declaration
 * Since this is a stateless component, we keep things as simple as possible.
 */
const Login = ({appState}) => (
  <div className="view login">
    <h1 className="view__headline">
      Log in with your Facebook or Google account.
    </h1>
    <div className="panel">
      <Auth appState={appState} />
      <p className="panel__description">
        If this is your first time here, don't worry! You can register in one
        click with your Facebook or Google account. Just click the link above.
      </p>
    </div>
  </div>
);

/*
 * ### Component Props
 */
Login.propTypes = {
  appState: React.PropTypes.object.isRequired,
};

/*
 * ### Export the Component
 */
export default Login;
