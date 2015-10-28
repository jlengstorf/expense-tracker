'use strict';

// libs
import React from 'react';
import moment from 'moment';
import {formatMoney} from 'accounting';
import debug from 'debug';

// debugger
const log = debug('components/Expense');

export default function Expense(props) {
  const {
    expense,
    categories,
    people,
  } = props;

  people.forEach(log);

  const date = moment(expense.date).format('MMM D, YYYY');
  const category = categories.get(expense.category);
  const person = people.get(expense.personID);

  log(`date: ${date}`);
  log(person);

  return (
    <li>
      <ul>
        <li>{date}</li>
        <li>{formatMoney(expense.amount)}</li>
        <li>{expense.vendor}</li>
        <li>{person.fname}</li>
      </ul>
    </li>
  );
}
