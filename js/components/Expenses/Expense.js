/* @flow */
'use strict';

// libs
import React, {Component} from 'react';
import moment from 'moment';
import classnames from 'classnames';
import {formatMoney} from 'accounting';
import debug from 'debug';

// addons
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

// components
import Add from '../Add';
import Input from '../Form/Input';
import Select from '../Form/Select';

// dispatcher
import {dispatch} from '../../dispatcher';

// types
import type Immutable from 'immutable';
import type {Expense as ExpenseRecord} from '../../models/ExpenseModel';
import type Category from '../../models/CategoryModel';
import type Person from '../../models/PersonModel';

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
  appState: Immutable.Map<string, boolean>,
  expense: Immutable.Map<string, ExpenseRecord>,
  categories: Immutable.Map<string, Category>,
  people: Immutable.Map<string, Person>,
};

type State = {
  expense: ExpenseRecord
};

// constants
const ENTER_KEY_CODE = 13;

export default class Expense extends Component<{}, Props, State> {

  constructor(props: Props): void {
    super(props);

    this.state = {
      expense: this.props.expense,
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

    const isEditing = this.props.appState.get('currentlyEditing') === this.state.expense.id;

    /* jscs:disable disallowQuotedKeysInObjects */
    const classes = classnames({
      'expenses__item': true,
      'expense': true,
      'expense--editing': isEditing,
    });
    /* jscs:enable disallowQuotedKeysInObjects */

    let editingForm = null;
    if (isEditing) {
      editingForm = (
        <div key={this.state.expense.id} className="expense__update-form">
          <Add
            appState={this.props.appState}
            buttonText="Update Expense"
            expense={this.state.expense}
            categories={categories}
            people={people}
            changeHandler={this._onChange.bind(this)}
            submitHandler={this._onSubmit.bind(this)}
            cancelText="cancel"
            cancelCB={this._toggleEditing.bind(this)}
          />
        </div>
      );
    }

    return (
      <li className={classes} onDoubleClick={this._onDoubleClick.bind(this)}>
        <div
          className="expense__display"
          data-category={category.name}
        >
          <span className="expense__paidby">
            {person.first_name}
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
          {this.getControlMarkup('edit')}
          {this.getControlMarkup('delete')}
        </div>
        <ReactCSSTransitionGroup
          transitionName="editing"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
        >
          {editingForm}
        </ReactCSSTransitionGroup>
      </li>
    );
  }

  getControlMarkup(type): ReactElement {
    let icon;
    let clickCB;

    if (type === 'edit') {
      icon = 'pencil';
      clickCB = this._toggleEditing.bind(this);
    } else {
      icon = 'times-circle-o';
      clickCB = _delete.bind(null, this.state.expense.id);
    }

    const classes = `expense__control expense__control--${type}`;

    return (
      <button className={classes} onClick={clickCB}>
        <span className="sr-only">{type}</span>
        <i className={`fa fa-${icon}`} />
      </button>
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

    let expenseID = this.state.expense.id;

    // Saves the updated expense if we were editing
    if (this.props.appState.get('currentlyEditing')) {
      dispatch({
        type: 'expense/update',
        id: expenseID,
        expense: this.state.expense,
      });

      // Now that the editing is done, we want to unset currentlyEditing
      expenseID = false;
    }

    dispatch({
      type: 'app/update-setting',
      setting: 'currentlyEditing',
      value: expenseID,
    });
  }

  _onSubmit(event): void {
    event.preventDefault();
    this._toggleEditing();
  }

  _onDoubleClick(): void {
    if (!this.props.appState.get('currentlyEditing')) {
      this._toggleEditing();
    }
  }

}
