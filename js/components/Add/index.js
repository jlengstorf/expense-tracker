'use strict';

// libs
import React, {Component} from 'react';
import {Map} from 'immutable';
import moment from 'moment';
import debug from 'debug';

// components
// import Expense from './Expense';

// dispatcher
import {dispatch} from '../../dispatcher';

// debugger
const log = debug('components/Add');

type Props = {
  categories: object,
  people: object,
};

type State = {
  date: string,
  amount: number,
  vendor: number,
  categoryID: number,
  personID: number,
};

export default class Add extends Component<{}, Props, State> {

  constructor(props) {
    super(props);

    log('TODO Set the personID to match the logged in user');
    this.state = {
      data: Map({
        date: moment().format('YYYY-MM-DD'),
        amount: '',
        vendor: '',
        categoryID: false,
        personID: false,
      }),
    };
  }

  render(): ?ReactElement {
    const {
      categories,
      people,
    } = this.props;

    return (
      <form onSubmit={this._onSubmit.bind(this)}>
        <h2>Add an Expense</h2>
        <div>
          <label htmlFor="date">Date</label>
          <input
            id="date"
            name="date"
            type="text"
            pattern="(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))"
            placeholder="YYYY-MM-DD"
            value={this.state.data.get('date')}
            onChange={this._onChange.bind(this)}
          />
        </div>
        <div>
          <label htmlFor="amount">Amount</label>
          <input
            id="amount"
            name="amount"
            type="number"
            placeholder="0.00"
            value={this.state.data.get('amount')}
            onChange={this._onChange.bind(this)}
          />
        </div>
        <div>
          <label htmlFor="vendor">Vendor</label>
          <input
            id="vendor"
            name="vendor"
            type="text"
            placeholder="e.g. Acme Corp"
            value={this.state.data.get('vendor')}
            onChange={this._onChange.bind(this)}
          />
        </div>
        <div>
          <label htmlFor="categoryID">Category</label>
          <select
            id="categoryID"
            name="categoryID"
            onChange={this._onChange.bind(this)}
            value={this.state.data.get('categoryID')}
          >
            {categories.valueSeq().map(category => {
              return (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <label htmlFor="personID">Paid By</label>
          <select
            id="personID"
            name="personID"
            onChange={this._onChange.bind(this)}
            value={this.state.data.get('personID')}
          >
            {people.valueSeq().map(person => {
              return (
                <option key={person.id} value={person.id}>
                  {person.fname}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <button>Add Expense</button>
        </div>
      </form>
    );
  }

  _onSubmit(event) {
    event.preventDefault();

    const expense = this.state.data.toObject();
    log(expense);

    dispatch({
      type: 'expense/create',
      expense: expense,
    });

    return false;
  }

  _onChange(event) {
    const {
      name,
      value,
    } = event.target;

    this.setState(({data}) => ({
      data: data.set(name, value),
    }));
  }
}
