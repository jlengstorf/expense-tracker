/*
 * # app.js
 * This is the script that starts the app.
 *
 * @flow
 */
'use strict';

/*
 * ## JS Dependencies
 */

// libs
import React from 'react';
import ReactDOM from 'react-dom';

// components
import ExpenseTracker from './components/ExpenseTracker';

/*
 * ## Styles
 * Stylesheets are included like JavaScript files because webpack is crafty.
 */
import '../node_modules/font-awesome/css/font-awesome.min.css';
import '../css/main.css';

/*
 * # Start the Application
 * We attach the ExpenseTracker component to the DOM, which is where the app
 * officially starts.
 */
ReactDOM.render(
  <ExpenseTracker />,
  document.getElementById('expense-tracker')
);
