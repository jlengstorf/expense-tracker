/* @flow */
'use strict';

// // libs
import React, {Component} from 'react';
import {Container} from 'flux/utils';
import debug from 'debug';

// components
import Add from './Add';
import Expenses from './Expenses';
import Total from './Total';
import Debts from './Debts';

// models
import type Immutable from 'immutable';
import type Expense from '../models/ExpenseModel';

// stores
import AppStateStore from '../stores/AppStateStore';
import ExpenseStore from '../stores/ExpenseStore';
import CategoryStore from '../stores/CategoryStore';
import PersonStore from '../stores/PersonStore';
import SpendingStore from '../stores/SpendingStore';
import DebtStore from '../stores/DebtStore';

// dispatcher
import {dispatch} from '../dispatcher';

// debugger
const log = debug('components/ExpenseTracker');

// types
type State = {
  appState: Immutable.Map<string, Expense>,
  expenses: Immutable.Map<string, Expense>,
  categories: Immutable.Map<string, Category>,
  people: Immutable.Map<string, Person>,
  spending: Immutable.Map<string, Spending>,
  debts: Immutable.Map<string, Debt>,
};

class ExpenseTracker extends Component<{}, {}, State> {

  static getStores(): Array<Store> {
    return [
      AppStateStore,
      ExpenseStore,
      CategoryStore,
      PersonStore,
      SpendingStore,
      DebtStore,
    ];
  }

  static calculateState(prevState: ?State): Object {
    return {
      appState: AppStateStore.getState(),
      expenses: ExpenseStore.getState(),
      categories: CategoryStore.getState(),
      people: PersonStore.getState(),
      spending: SpendingStore.getState(),
      debts: DebtStore.getState(),
    };
  }

  componentDidMount(): void {
    // dispatch({
    //   type: 'app/initialize',
    // });
  }

  render(): ReactElement {
    let categories = [];
    this.state.spending.valueSeq().map(category => {
      let splits = [];
      category.split.map(split => {
        const {name, portion, percent} = split;
        splits[category.id + name] = (
          <span key={category.id + name}>
            {name} pays {portion} [{percent}%]
          </span>
        );
      });

      categories[category.id] = (
        <p key={category.id}>
          Category: {category.name} ({splits.join(', ')})
        </p>
      );
    });

    let addForm;
    if (this.state.appState.get('isFormVisible')) {
      addForm = (
        <Add
          appState={this.state.appState}
          categories={this.state.categories}
          people={this.state.people}
          cancelText="done adding expenses"
          cancelCB={this._toggleAddForm.bind(this)}
        />
      );
    } else {
      addForm = (
        <a
          className="expense-tracker__toggle-form"
          href="#"
          onClick={this._toggleAddForm.bind(this)}
        >
          Add Expenses
        </a>
      );
    }

    return (
      <div className="expense-tracker">
        <Debts debts={this.state.debts} people={this.state.people} />
        <div className="expense-tracker__add-form">
          {addForm}
        </div>
        <Expenses
          appState={this.state.appState}
          expenses={this.state.expenses}
          categories={this.state.categories}
          people={this.state.people}
        />
        <Total expenses={this.state.expenses} />
      </div>
    );
  }

  _toggleAddForm(): void {
    dispatch({
      type: 'app/toggle-setting',
      setting: 'isFormVisible',
    });
  }

}

const ExpenseTrackerContainer = Container.create(ExpenseTracker);
export default ExpenseTrackerContainer;
