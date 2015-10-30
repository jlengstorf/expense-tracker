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
      this.state = {
        expense: Map({
          date: moment().format('YYYY-MM-DD'),
          amount: '',
          vendor: '',
          categoryID: false,
          personID: false,
        }),
      };
    }
  }

  componentWillReceiveProps(nextProps: Props): void {

    // Starts by checking that the categoryID is valid
    if (!this.state.expense.categoryID && nextProps.categories.size > 0) {
      log('categoryID is false; setting manually.');
      this.setState(({expense}) => ({
        expense: expense.set('categoryID', nextProps.categories.first().id),
      }));
      log(`categoryID: ${nextProps.categories.first().id}`);
    }

    // Checks that the personID is valid
    if (!this.state.expense.personID && nextProps.people.size > 0) {
      log('personID is false; setting manually.');
      log('TODO Set the personID to match the logged in user');
      this.setState(({expense}) => ({
        expense: expense.set('personID', nextProps.people.first().id),
      }));
      log(`personID: ${nextProps.people.first().id}`);
    }
  }

  render(): ?ReactElement {
    const {
      categories,
      people,
    } = this.props;

    let changeCB = this._onChange.bind(this);
    if (typeof this.props.changeHandler === 'function') {
      log('this.props.changeHandler was set');
      changeCB = this.props.changeHandler;
    } else {
      log('no changeHandler set');
    }

    let submitCB = this._onSubmit.bind(this);
    if (typeof this.props.submitHandler === 'function') {
      log('this.props.submitHandler was set');
      submitCB = this.props.submitHandler;
    } else {
      log('no submitHandler set');
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
        <div>
          <input type="submit" value="Add Expense" />
        </div>
      </form>
    );
  }

  _onSubmit(event) {
    event.preventDefault();

    const expense = this.state.expense.toObject();
    log(expense);

    // TODO add validation to make sure expenses are legit
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
