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
        <li className="expense__date-banner" key={newToday}>
          {moment(expense.date).format("MMMM D, YYYY")}
        </li>
      );

      today = newToday;
    }

    // Creates expenses
    listItems.push(
      <Expense
        key={expense.id}
        expense={expense}
        categories={categories}
        people={people}
      />
    );
  });

  return (
    <div className="expenses">
      <h2 className="expenses__heading">List of Expenses</h2>
      <ul className="expenses__list">
        <ReactCSSTransitionGroup transitionName="expense" transitionAppear={true} transitionAppearTimeout={500} transitionEnterTimeout={500} transitionLeaveTimeout={300}>
          {listItems}
        </ReactCSSTransitionGroup>
      </ul>
    </div>
  );
}
