'use strict';

// libs
import React from 'react';
import debug from 'debug';

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

  expenses.valueSeq().forEach(log);

  return (
    <div className="expenses">
      <h2 className="expenses__heading">List of Expenses</h2>
      <ul className="expenses__list">
        {expenses.valueSeq().map(expense => {
          return (
            <Expense
              key={expense.id}
              expense={expense}
              categories={categories}
              people={people}
            />
          );
        })}
      </ul>
    </div>
  );
}
