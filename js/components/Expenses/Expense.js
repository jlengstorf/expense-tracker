/* @flow */
'use strict';

// libs
import React, {Component} from 'react';
import moment from 'moment';
import classnames from 'classnames';
import {formatMoney} from 'accounting';
import debug from 'debug';

// components
import Add from '../Add';
import Input from '../Form/Input';
import Select from '../Form/Select';

// dispatcher
import {dispatch} from '../../dispatcher';

// debugger
const log = debug('components/Expense');

// helper function
function _delete(id, event) {
  event.preventDefault();
  dispatch({
    type: 'expense/delete',
    id: id,
  });
}

// types
type Props = {
  expense: Expense,
  categories: Map,
  people: Map,
};

type State = {
  expense: Expense,
  isEditing: boolean,
};

// constants
const ENTER_KEY_CODE = 13;

export default class Expense extends Component<{}, Props, State> {

  constructor(props: Props): void {
    super(props);

    this.state = {
      expense: this.props.expense,
      isEditing: false,
    };
  }

  render(): ReactElement {
    const {
      categories,
      people,
    } = this.props;

    const date = moment(this.state.expense.date).format('MMM D, YYYY');
    const category = categories.get(this.state.expense.categoryID);
    const person = people.get(this.state.expense.personID);

    /* jscs:disable disallowQuotedKeysInObjects */
    const classes = classnames({
      'expenses__item': true,
      'expense': true,
      'expense--editing': this.state.isEditing,
    });
    /* jscs:enable disallowQuotedKeysInObjects */

    return (
      <li className={classes} onDoubleClick={this._onDoubleClick.bind(this)}>
        <div
          className="expense__display"
          data-category={category.name}
        >
          <span className="expense__paidby">
            {person.fname}
          </span>
          <span className="expense__amount">
            {formatMoney(this.state.expense.amount)}
          </span>
          <span className="expense__vendor">
            {this.state.expense.vendor}
          </span>
          <span className="expense__category">
            {category.name}
          </span>
        </div>
        <div className="expense__controls">
          <button
            className="expense__control expense__control--edit"
            onClick={this._toggleEditing.bind(this)}
          >
            <span className="sr-only">
              {(this.state.isEditing) ? 'save' : 'edit'}
            </span>
            <i
              className={`fa fa-${!this.state.isEditing ? 'pencil' : 'check'}`}
            />
          </button>
          <button
            className="expense__control expense__control--delete"
            onClick={_delete.bind(null, this.state.expense.id)}
          >
            <span className="sr-only">delete</span>
            <i className="fa fa-times-circle-o" />
          </button>
        </div>
        <div className="expense__update-form">
          <Add
            expense={this.state.expense}
            categories={categories}
            people={people}
            changeHandler={this._onChange.bind(this)}
            submitHandler={this._onSubmit.bind(this)}
          />
        </div>
      </li>
    );
  }

  _onChange(event: SyntheticEvent): void {
    let {name, value} = event.target;

    log('_onChange()');

    // Parses the date into a UTC timestamp
    if (name === 'date') {
      value = +moment(value, 'YYYY-MM-DD');
    }

    // Makes sure the amount is saved as a number, not a string
    if (name === 'amount') {
      value = +value;
    }

    this.setState(({expense}) => ({
      expense: expense.set(name, value),
    }));
  }

  _toggleEditing(): void {

    // Saves the updated expense if we were editing
    if (this.state.isEditing) {
      dispatch({
        type: 'expense/update',
        id: this.state.expense.id,
        expense: this.state.expense,
      });
    }

    this.setState({isEditing: !this.state.isEditing});
  }

  _disableEditing(): void {
    this.setState({isEditing: false});
  }

  _onSubmit(event): void {
    event.preventDefault();
    this._toggleEditing();
  }

  _onDoubleClick(): void {
    if (!this.state.isEditing) {
      this._toggleEditing();
    }
  }

}
