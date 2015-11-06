'use strict';

//libs
import React from 'react';
import ReactDOM from 'react-dom';

// components
import ExpenseTracker from './components/ExpenseTracker';

// styles (via webpack)
import '../node_modules/font-awesome/css/font-awesome.min.css';
import '../css/main.css';

ReactDOM.render(
  <ExpenseTracker />,
  document.getElementById('expense-tracker')
);
