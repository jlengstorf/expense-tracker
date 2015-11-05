/* @flow */
'use strict';

// // libs
import React, {Component} from 'react';
import {Container} from 'flux/utils';
import Aviator from 'aviator';
import debug from 'debug';

// router
import Router, {routeConfig} from '../router';
Aviator.setRoutes(routeConfig);
Aviator.dispatch();

// components
import Add from './Add';
import Expenses from './Expenses';
import Total from './Total';
import Debts from './Debts';
import Auth from './Auth';

// models
import type Immutable from 'immutable';
import type Expense from '../models/ExpenseModel';

// stores
import AppStateStore from '../stores/AppStateStore';
import ExpenseStore from '../stores/ExpenseStore';
import GroupStore from '../stores/GroupStore';
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
  groups: Immutable.Map<string, Group>,
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
      GroupStore,
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
      groups: GroupStore.getState(),
      categories: CategoryStore.getState(),
      people: PersonStore.getState(),
      spending: SpendingStore.getState(),
      debts: DebtStore.getState(),
    };
  }

  componentDidMount(): void {
    dispatch({
      type: 'app/initialize',
    });
  }

  render(): ReactElement {
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

    let pageDisplay;
    if (this.state.appState.getIn(['view', 'page'])) {
      const view = this.state.appState.getIn(['view', 'page']);

      let id;
      if (this.state.appState.getIn(['view', 'params']).id) {
        id = this.state.appState.getIn(['view', 'params']).id;
      }

      const pageData = id ? <p>{id}</p> : '';

      pageDisplay = (
        <div>
          <h1>{view}</h1>
          {pageData}
        </div>
      );
    }

    return (
      <div className="expense-tracker">
        <Auth appState={this.state.appState} />
        <a onClick={this._navigate.bind(null, '/test')}>test</a>
        <a onClick={this._navigate.bind(null, '/home')}>home</a>

        {pageDisplay}
      </div>
    );

    // <Debts debts={this.state.debts} people={this.state.people} />
    // <div className="expense-tracker__add-form">
    //   {addForm}
    // </div>
    // <Expenses
    //   appState={this.state.appState}
    //   expenses={this.state.expenses}
    //   categories={this.state.categories}
    //   people={this.state.people}
    // />
    // <Total expenses={this.state.expenses} />
  }

  _toggleAddForm(): void {
    dispatch({
      type: 'app/toggle-setting',
      setting: 'isFormVisible',
    });
  }

  _navigate(uri): void {
    Aviator.navigate(uri);
  }

}

const ExpenseTrackerContainer = Container.create(ExpenseTracker);
export default ExpenseTrackerContainer;
