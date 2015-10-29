/* @flow */
'use strict';

// libs
import React, {Component} from 'react';
import moment from 'moment';
import classnames from 'classnames';
import {formatMoney} from 'accounting';
import debug from 'debug';

// components
import Input from '../Form/Input';
import Select from '../Form/Select';

// dispatcher
import {dispatch} from '../../dispatcher';

// debugger
const log = debug('components/Expense');

// helper function
function _delete(event) {
  log(event);
  event.preventDefault();
  dispatch({
    type: 'expense/delete',
    id: event.target.getAttribute('data-id'),
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

  render() {
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
        <ul className="expense__list">
          <li className="expense__item">
            <span className="expense__data-display">
              {moment(this.state.expense.date).format('MMM D')}
            </span>
            <Input
              name="date"
              inputClass="expense__input"
              value={moment(this.state.expense.date).format('YYYY-MM-DD')}
              changeHandler={this._onChange.bind(this)}
              keyDownHandler={this._onKeyDown.bind(this)}
            />
          </li>
          <li className="expense__item">
            <span className="expense__data-display">
              {formatMoney(this.state.expense.amount)}
            </span>
            <Input
              name="amount"
              inputClass="expense__input"
              type="number"
              value={this.state.expense.amount}
              changeHandler={this._onChange.bind(this)}
              keyDownHandler={this._onKeyDown.bind(this)}
            />
          </li>
          <li className="expense__item">
            <span className="expense__data-display">
              {this.state.expense.vendor}
            </span>
            <Input
              name="vendor"
              inputClass="expense__input"
              value={this.state.expense.vendor}
              changeHandler={this._onChange.bind(this)}
              keyDownHandler={this._onKeyDown.bind(this)}
            />
          </li>
          <li className="expense__item">
            <span className="expense__data-display">
              <span className="sr-only">{category.name}</span>
              <i className={`fa fa-${category.icon} expense__category-icon`}></i>
            </span>
            <Select
              name="categoryID"
              inputClass="expense__input"
              value={category.id}
              options={categories}
              changeHandler={this._onChange.bind(this)}
            />
          </li>
          <li className="expense__item">
            <span className="expense__data-display">
              {person.fname}
            </span>
            <Select
              name="personID"
              inputClass="expense__input"
              value={person.id}
              options={people}
              changeHandler={this._onChange.bind(this)}
            />
          </li>
          <li className="expense__item">
            <a
              href="#"
              className="expense__edit-control"
              onClick={this._toggleEditing.bind(this)}
            >
              <span className="sr-only">{(this.state.isEditing) ? 'save' : 'edit'}</span>
              <i className={`fa fa-${!this.state.isEditing ? 'pencil' : 'check'}`} />
            </a>
            <a
              href="#"
              className="expense__edit-control"
              data-id={this.state.expense.id}
              onClick={_delete}
            >
              <span className="sr-only">delete</span>
              <i className="fa fa-times-circle-o" />
            </a>
          </li>
        </ul>
      </li>
    );
  }

  _onChange(event: SyntheticEvent): void {
    let {name, value} = event.target;

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

  _onKeyDown(event): void {
    if (event.keyCode === ENTER_KEY_CODE) {
      this._toggleEditing();
    }
  }

  _onDoubleClick(): void {
    if (!this.state.isEditing) {
      this._toggleEditing();
    }
  }

}
