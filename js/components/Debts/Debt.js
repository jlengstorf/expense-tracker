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
    <li>
      {debtor.fname} owes {formatMoney(amount)} to {lender.fname}.
    </li>
  );
}
