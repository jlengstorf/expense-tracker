/* @flow */
'use strict';

// libs
import React from 'react';
import hello from 'hellojs';
import classnames from 'classnames';

// config
import config from 'config';

// dispatcher
import {dispatch} from '../../dispatcher';

// helpers
import {ucfirst} from '../../helpers/string';

// css
// import '/node_modules/css-social-buttons/css/zocial.css';

// stateless React component
export default function Login(props) {
  const buttons = _getLoginButtons();
  const cancelCB = props.cancelCB || () => {};

  const classes = classnames({
    auth__login: true,
    loading: props.appState.get('isModalLoading'),
  });

  return (
    <div className="modal">
      <div className={classes}>
        {buttons}

        <a href="#" onClick={cancelCB} className="modal__close">cancel</a>
      </div>
    </div>
  );
}

// pure helper functions
function _getLoginButtons(): ReactElement {
  let buttons = [];

  Object.keys(config.oauth.networks).forEach(network => {
    buttons.push(
      <button
        key={network}
        className={`button auth__button button--${network}`}
        onClick={_login.bind(null, network)}
      >
        Log in with {ucfirst(network)}
      </button>
    );
  });

  return buttons;
}

function _login(network, event) {
  event.preventDefault();

  // Adds an overlay to the login window to show activity
  dispatch({
    type: 'app/update-setting',
    setting: 'isModalLoading',
    value: true,
  });

  hello(network).login(config.oauth.settings.login);
}
