/* @flow */
'use strict';

// libs
import React from 'react';
import hello from 'hellojs';
import debug from 'debug';

import config from 'config';

// dispatcher
import {dispatch} from '../../dispatcher';

// debugger
const log = debug('components/Auth');

const networks = [
  {
    name: 'facebook',
    label: 'Log in with Facebook',
  },
  {
    name: 'google',
    label: 'Log in with Google',
  },
  {
    name: 'twitter',
    label: 'Log in with Twitter',
  },
];

// stateless React component
export default function Auth(props) {

  // Loops through networks and builds buttons
  const buttons = networks.map(network => {
    const loginCB = _login.bind(null, network.name);
    const logoutCB = _logout.bind(null, network.name);

    return (
      <div key={network.name}>
        <button onClick={loginCB}>
          {network.label}
        </button>
        <button onClick={logoutCB}>
          {network.name} logout
        </button>
      </div>
    );
  });

  let loginStatus;
  if (props.appState.get('user')) {
    const user = props.appState.get('user');
    loginStatus = (
      <p>Logged in as {user.name}.</p>
    );
  }

  return (
    <div className="auth">
      {loginStatus}
      {buttons}
    </div>
  );
}

// pure helpers
function _login(network, event) {
  event.preventDefault();

  hello(network).login({scope: 'email'})
    .then(log, log);
}

function _logout(network, event) {
  event.preventDefault();

  hello(network).logout()
    .then(log, log);
}

hello.on('auth.login', auth => {
  hello(auth.network).api('/me').then(result => {

    // Dispatches the info for processing
    dispatch({
      type: 'user/register-or-login',
      data: result,
    });

  });
});

hello.init({
  facebook: config.auth.FACEBOOK_APP_ID,
  google: config.auth.GOOGLE_APP_ID,
  twitter: config.auth.TWITTER_APP_ID,
}, {redirect_uri: 'redirect.html'});
