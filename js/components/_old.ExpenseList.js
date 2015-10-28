// libs
import React, {Component, PropTypes} from 'react';
import classnames from 'classnames';

// components
import Expense from './Expense';

const EXPENSE_LIST_CLASS = 'expense-list';

class ExpenseList extends Component {

  render() {
    return (
      <ul className={EXPENSE_LIST_CLASS}>
        {Object.keys(this.props.expenses).map(id => {
          return (
            <li key={id} className={`${EXPENSE_LIST_CLASS}__item`}>
              <Expense id={id} {...this.props.expenses[id]} />
            </li>
          );
        })}
      </ul>
    );
  }

};

ExpenseList.propTypes = {
  expenses: PropTypes.object.isRequired,
};

export default ExpenseList;
