'use strict';

// libs
import React from 'react';
import debug from 'debug';

// components
import Debt from './Debt';

// debugger
const log = debug('components/Debts');

export default function Debts(props) {
  const debts = props.debts.valueSeq().map(debt => {
    const debtor = props.people.get(debt.debtorID);
    const lender = props.people.get(debt.lenderID);

    return (
      <Debt key={debt.id} debtor={debtor} lender={lender} amount={debt.amount} />
    );
  });

  return (
    <div className="debts">
      <ul className="debts__list">
        {debts}
      </ul>
    </div>
  );
}
