'use strict';

// libs
import React from 'react';
import moment from 'moment';
import debug from 'debug';

// addons
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

// components
import Expense from './Expense';

// debugger
const log = debug('components/Expenses');

export default function Expenses(props) {
  const {
    appState,
    expenses,
    categories,
    people,
  } = props;

  // Creates date and
  let listItems = [];
  let today;

  expenses.map(expense => {

    // Adds a date banner if it's a new day
    const newToday = moment(expense.date).format("YYYY-MM-DD");
    if (newToday !== today) {
      listItems.push(
        <li className="expenses__date-banner" key={newToday}>
          {moment(expense.date).format("MMMM D, YYYY")}
        </li>
      );

      today = newToday;
    }

    // Creates expenses
    listItems.push(
      <Expense
        key={expense.id}
        appState={appState}
        expense={expense}
        categories={categories}
        people={people}
      />
    );
  });

  return (
    <div className="expenses">
      <ul className="expenses__list">
        <ReactCSSTransitionGroup
          transitionName="expense"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
        >
          {listItems}
        </ReactCSSTransitionGroup>
      </ul>
    </div>
  );
}
