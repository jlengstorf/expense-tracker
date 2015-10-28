import React from 'react';
import ReactDOM from 'react-dom';

import {dispatch} from './dispatcher';

import ExpenseTracker from './components/ExpenseTracker';

ReactDOM.render(
  <ExpenseTracker />,
  document.getElementById('expense-tracker')
);

dispatch({
  type: 'app/initialize',
});
