'use strict';

// libs
import React from 'react';
import {formatMoney} from 'accounting';
import debug from 'debug';

// debugger
const log = debug('components/Total');

function getTotal(expenses) {
  let total = 0;
  expenses.valueSeq().forEach(expense => {
    total += expense.amount;
  });

  log(`getTotal() returns ${total}`);
  return total;
}

export default function Total(props) {
  const total = getTotal(props.expenses);
  return (
    <div>
      <h2>Total Spending</h2>
      <p>{formatMoney(total)}</p>
    </div>
  );
}
