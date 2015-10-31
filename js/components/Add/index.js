/* @flow */
'use strict';

// libs
import React, {Component} from 'react';
import {Map} from 'immutable';
import moment from 'moment';
import debug from 'debug';

// components
import Input from '../Form/Input';
import Select from '../Form/Select';

// dispatcher
import {dispatch} from '../../dispatcher';

// debugger
const log = debug('components/Add');

// types
import Expense from '../../models/ExpenseModel';

type Props = {
  buttonText: ?string,
  expense: ?object,
  categories: object,
  people: object,
  changeHandler: ?Function,
  submitHandler: ?Function,
};

type State = {
  date: string,
  amount: number,
  vendor: number,
  categoryID: ?string,
  personID: ?string,
};

const ERROR_TYPE = 'form-error';
const ERROR_MESSAGE = 'All fields are required for creating new expenses.';

export default class Add extends Component<{}, Props, State> {

  constructor(props: Props): void {
    super(props);

    // If an expense was supplied, updates the state
    const expense = this.props.expense || {};
    if (this.props.expense instanceof Expense) {
      this.state = {
        expense: this.props.expense,
      };
    } else {

      // Otherwise, initializes with an empty expense
      const {categories, people} = this.props;

      this.state = {
        expense: Map({
          date: moment().format('YYYY-MM-DD'),
          amount: '',
          vendor: '',
          categoryID: categories.size > 0 ? categories.first().id : null,
          personID: people.size > 0 ? people.first().id : null,
        }),
      };

      log('TODO Set default personID to match the logged in user');
    }
  }

  render(): ?ReactElement {
    const {
      categories,
      people,
    } = this.props;

    const buttonText = this.props.buttonText || 'Add Expense';

    let error;
    if (
      !!this.props.appState.get('error') &&
      this.props.appState.get('error').type === ERROR_TYPE
    ) {
      error = (
        <div className="form__error">
          <p className="form__error-message">
            {this.props.appState.get('error').message}
          </p>
        </div>
      );
    }

    let changeCB = this._onChange.bind(this);
    if (typeof this.props.changeHandler === 'function') {
      log('this.props.changeHandler was set');
      changeCB = this.props.changeHandler;
    }

    let submitCB = this._onSubmit.bind(this);
    if (typeof this.props.submitHandler === 'function') {
      log('this.props.submitHandler was set');
      submitCB = this.props.submitHandler;
    }

    return (
      <form onSubmit={submitCB}>
        <Input
          label="Date"
          name="date"
          pattern="(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))"
          value={moment(this.state.expense.date).format('YYYY-MM-DD')}
          changeHandler={changeCB}
        />
        <Input
          label="Amount"
          name="amount"
          type="number"
          pattern="\d+(\.\d{2})?"
          placeholder="0.00"
          value={this.state.expense.amount}
          changeHandler={changeCB}
        />
        <Input
          label="Vendor"
          name="vendor"
          placeholder="e.g. Acme Corp"
          value={this.state.expense.vendor}
          changeHandler={changeCB}
        />
        <Select
          label="Category"
          name="categoryID"
          value={this.state.expense.categoryID}
          options={categories}
          changeHandler={changeCB}
        />
        <Select
          label="Paid By"
          name="personID"
          value={this.state.expense.personID}
          options={people}
          changeHandler={changeCB}
        />
        {error}
        <div className="form__controls">
          <input className="form__submit" type="submit" value={buttonText} />
          <a href="#" className="form__cancel" onClick={this.props.cancelCB}>
            {this.props.cancelText}
          </a>
        </div>
      </form>
    );
  }

  _onSubmit(event) {
    event.preventDefault();

    const expense = this.state.expense.toObject();
    log(expense);

    // basic expense validation
    // TODO should this live somewhere else?
    let error = false;
    if (
      +expense.amount === 0 ||
      expense.vendor === ''
    ) {

      // TODO how are errors going to work?
      dispatch({
        type: 'app/update-setting',
        setting: 'error',
        value: {
          type: ERROR_TYPE,
          message: ERROR_MESSAGE,
        },
      });

      return false;
    } else {

      // if there are no errors, clear any error messages
      dispatch({
        type: 'app/update-setting',
        setting: 'error',
        value: {
          type: false,
          message: false,
        },
      });
    }

    dispatch({
      type: 'expense/create',
      expense: expense,
    });
  }

  _onChange(event) {
    let {
      name,
      value,
    } = event.target;

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
}
