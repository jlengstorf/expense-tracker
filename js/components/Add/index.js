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

type Props = {
  categories: object,
  people: object,
};

type State = {
  date: string,
  amount: number,
  vendor: number,
  categoryID: ?string,
  personID: ?string,
};

export default class Add extends Component<{}, Props, State> {

  constructor(props) {
    super(props);

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

  componentWillReceiveProps(nextProps: Props): void {

    // Starts by checking that the categoryID is valid
    if (!this.state.data.categoryID && nextProps.categories.size > 0) {
      log('categoryID is false; setting manually.');
      this.setState(({data}) => ({
        data: data.set('categoryID', nextProps.categories.first().id),
      }));
      log(`categoryID: ${nextProps.categories.first().id}`);
    }

    // Checks that the personID is valid
    if (!this.state.data.personID && nextProps.people.size > 0) {
      log('personID is false; setting manually.');
      log('TODO Set the personID to match the logged in user');
      this.setState(({data}) => ({
        data: data.set('personID', nextProps.people.first().id),
      }));
      log(`personID: ${nextProps.people.first().id}`);
    }
  }

  render(): ?ReactElement {
    const {
      categories,
      people,
    } = this.props;

    return (
      <form onSubmit={this._onSubmit.bind(this)}>
        <h2>Add an Expense</h2>
        <Input
          label="Date"
          name="date"
          pattern="(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))"
          value={moment(this.state.data.date).format('YYYY-MM-DD')}
          changeHandler={this._onChange.bind(this)}
        />
        <Input
          label="Amount"
          name="amount"
          type="number"
          value={this.state.data.amount}
          changeHandler={this._onChange.bind(this)}
        />
        <Input
          label="Vendor"
          name="vendor"
          placeholder="e.g. Acme Corp"
          value={this.state.data.vendor}
          changeHandler={this._onChange.bind(this)}
        />
        <Select
          label="Category"
          name="categoryID"
          value={this.state.data.categoryID}
          options={categories}
          changeHandler={this._onChange.bind(this)}
        />
        <Select
          label="Paid By"
          name="personID"
          value={this.state.data.personID}
          options={people}
          changeHandler={this._onChange.bind(this)}
        />
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
