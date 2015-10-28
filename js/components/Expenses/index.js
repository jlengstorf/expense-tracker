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
    <div>
      <h2>List of Expenses</h2>
      <ul>
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
