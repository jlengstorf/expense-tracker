/* @flow */
'use strict';

// libs
import React from 'react';
import hello from 'hellojs';
import debug from 'debug';

// config
import config from 'config';

// addons
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

// components
import Login from './Login';

// dispatcher
import {dispatch} from '../../dispatcher';

// helpers
import {ucfirst} from '../../helpers/string';

// debugger
const log = debug('components/Auth');

// stateless React component
export default function Auth(props) {
  let loginStatus;
  if (props.appState.getIn(['oauth', 'user'])) {
    const user = props.appState.getIn(['oauth', 'user']);
    const network = props.appState.getIn(['oauth', 'network']);
    loginStatus = (
      <p>
        Logged in as {user.name}. (
          <a
            href="#"
            onClick={_logout.bind(null, network)}
          >log out</a>
        )
      </p>
    );
  } else {
    loginStatus = (
      <p><a href="#" onClick={_showLogin} className="button auth__button">login or register</a></p>
    );
  }

  let loginButtons;
  if (props.appState.getIn(['oauth', 'showLogin'])) {
    loginButtons = (<Login cancelCB={_hideLogin} appState={props.appState} />);
  }

  return (
    <div className="auth">
      {loginStatus}
      <ReactCSSTransitionGroup
        transitionName="modal"
        transitionEnterTimeout={250}
        transitionLeaveTimeout={250}
      >
        {loginButtons}
      </ReactCSSTransitionGroup>
    </div>
  );
}

// pure helpers
function _showLogin(event) {
  event.preventDefault();

  dispatch({
    type: 'app/show-login',
  });
}

function _hideLogin(event) {
  event.preventDefault();

  dispatch({
    type: 'app/hide-login',
  });
}

function _logout(network, event) {
  event.preventDefault();

  hello(network).logout().then(() => {
    dispatch({
      type: 'user/logout',
    });
  });
}

// listeners and initialization for hello.js
hello.on('auth.login', auth => {
  hello(auth.network).api('/me').then(result => {

    // Dispatches the info for processing
    dispatch({
      type: 'user/oauth-succeeded',
      network: auth.network,
      data: result,
    });

  });
});

hello.init(config.oauth.networks, config.oauth.settings.init);
