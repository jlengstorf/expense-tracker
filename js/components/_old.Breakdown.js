// libs
import React, {Component, PropTypes} from 'react';
import debug from 'debug';
import {formatMoney} from 'accounting';

// stores
import CategoryStore from '../stores/CategoryStore';
import PersonStore from '../stores/PersonStore';
import DebtStore from '../stores/DebtStore';

// helpers
import {toNearestCent} from '../helpers/math';

// debugger
const log = debug('components/Breakdown');

// constants
const BREAKDOWN_CLASS = 'breakdown';

class Breakdown extends Component {

  constructor(props) {
    super(props);

    this.state = this._setComponentState();
  }

  render() {
    return (
      <div className={BREAKDOWN_CLASS}>
        <Breakdown.Total total={this._calculateTotalExpenses()} />
      </div>
    );
  }

  _setComponentState() {
    const categories = CategoryStore.getAllSpending();
    return {
      perPersonSpending: PersonStore.spending,
      perCategorySpending: CategoryStore.spending,
    };
  }

  _calculateTotalExpenses() {
    let total = 0;
    Object.keys(this.props.expenses).map(id => {
      total += this.props.expenses[id].amount;
    });

    return total;
  }

}

Breakdown.propTypes = {
  expenses: PropTypes.object.isRequired,
  categories: PropTypes.object.isRequired,
};

Breakdown.Total = function(props) {
  return (
    <p className={`${BREAKDOWN_CLASS}__total`}>
      Total Cost: ${props.total}
    </p>
  );
};

Breakdown.Category = function(props) {
  const totals = props.totals;

  return (
    <div className={`${BREAKDOWN_CLASS}__categories`}>
      <h2>Breakdown by Category</h2>
      <ul className={`${BREAKDOWN_CLASS}__categories-list`}>
        {Object.keys(totals).map(id => {
          const category = totals[id];
          return (
            <li key={category.name} className={`${BREAKDOWN_CLASS}__categories-item`}>
              {category.name}: {formatMoney(category.total)}
              <ul>
                {Object.keys(category.split).map(id => {
                  const split = category.split[id];
                  return (
                    <li key={id}>{split.name} is responsible for {formatMoney(split.portion)} ({split.percent}%)</li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

Breakdown.People = function(props) {
  const people = props.people;
  const debts = DebtStore.getAllDebts();

  const debtList = Object.keys(debts).map(personID => {
    const debt = debts[personID];
    const debtor = PersonStore.getPersonById(personID).fname;
    const lender = PersonStore.getPersonById(debt.owedTo).fname;

    return (
      <span key={personID}>{debtor} owes {formatMoney(debt.amount)} to {lender}.</span>
    );
  });

  return (
    <div className={`${BREAKDOWN_CLASS}__people`}>
      <h2>Spending by Person</h2>
      <ul className={`${BREAKDOWN_CLASS}__people-list`}>
        {Object.keys(people).map(id => {
          const person = people[id];
          return (
            <li key={id} className={`${BREAKDOWN_CLASS}__people-item`}>
              {person.name}: {formatMoney(person.spending.actual)} (Should be {formatMoney(person.spending.expected)})
            </li>
          );
        })}
      </ul>
      {debtList}
    </div>
  );
};

export default Breakdown;
