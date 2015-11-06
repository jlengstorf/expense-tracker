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
    const pageDisplay = this._renderView();

    // TODO Make the nav its own component
    const navLinks = [
      {name: 'Home', uri: '/home'},
      {name: 'Groups', uri: '/groups'},
      {name: 'Account', uri: '/account'},
      {name: 'Group Expenses', uri: '/1234/expenses'},
      {name: 'Group Categories', uri: '/1234/categories'},
      {name: 'Group Settings', uri: '/1234/settings'},
    ].map(link => {
      return (
        <li key={link.uri}>
          <a href={link.uri} onClick={this._navigate.bind(null, link.uri)}>
            {link.name}
          </a>
        </li>
      );
    });

    return (
      <div className="expense-tracker">
        <ul>
          {navLinks}
        </ul>

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

  _navigate(uri, event): void {
    event.preventDefault();
    Aviator.navigate(uri);
  }

  _renderView() {
    const view = this.state.appState.getIn(['view', 'page']);
    const params = this.state.appState.getIn(['view', 'params']);

    /*
     * We start with an empty array to ensure that there's always something to
     * return from the function.
     */
    let components = [];

    /*
     * Based on the current view, we can configure which components are visible
     * in the UI.
     */
    switch (view) {

      case 'home':
        components.push(<h1 key={`heading-${view}`}>Home</h1>);
        break;

      case 'groups':
        components.push(<h1 key={`heading-${view}`}>Groups</h1>);
        break;

      case 'account':
        components.push(<h1 key={`heading-${view}`}>Account</h1>);
        break;

      case 'expenses':
        components.push(<h1 key={`heading-${view}`}>Expenses</h1>);
        components.push(<p key={`id-${view}`}>Group ID: {params.group_id}</p>);
        break;

      case 'categories':
        components.push(<h1 key={`heading-${view}`}>Categories</h1>);
        components.push(<p key={`id-${view}`}>Group ID: {params.group_id}</p>);
        break;

      case 'settings':
        components.push(<h1 key={`heading-${view}`}>Group Settings</h1>);
        components.push(<p key={`id-${view}`}>Group ID: {params.group_id}</p>);
        break;

      // By default, show the login component only
      case 'login':
      default:
        components.push(<Auth appState={this.state.appState} />);
        break;

    }

    return components;
  }

  /*
   * TODO decide if this needs to live somewhere else
   */
  _showAddExpenseForm() {
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

    return addForm;
  }

}

/*
 * This component is a Container (of the fluxutils variety), which means it has
 * a two-way binding with the stores listed in `getStores()`. This is a
 * shortcut for setting up event emitters explicitly for each store.
 */
const ExpenseTrackerContainer = Container.create(ExpenseTracker);
export default ExpenseTrackerContainer;
