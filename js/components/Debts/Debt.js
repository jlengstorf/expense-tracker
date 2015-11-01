'use strict';

// libs
import React from 'react';
import {formatMoney} from 'accounting';
import debug from 'debug';

// debugger
const log = debug('components/Debt');

export default function Debt(props) {
  const {debtor, lender, amount} = props;

  return (
    <li className="debts__item">
      {debtor.first_name} owes {formatMoney(amount)} to {lender.first_name}.
    </li>
  );
}
