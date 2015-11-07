/*
 * # ExpenseTracker
 * The main component for the app, which handles routing and keeps track of the
 * app's stores.
 *
 * This component is a Flux Utils Container, which creates a two-way binding
 * with the stores. Ideally, the rest of the components will not have state,
 * instead relying on the state from this container.
 *
 * The only exception is a form element, which needs to keep track of state to
 * avoid sending tons of useless calls when the inputs change. Check out the
 * components in the `Form/` directory for more information on that.
 *
 * @see https://facebook.github.io/flux/docs/flux-utils.html#container
 *
 * @flow
 */
'use strict';

/*
 * ## Dependencies
 */

// libs
import React, {Component} from 'react';
import {Container} from 'flux/utils';
import Aviator from 'aviator';
import classnames from 'classnames';
import debug from 'debug';

// router
import Router, {routeConfig} from '../router';
Aviator.setRoutes(routeConfig);
Aviator.dispatch();

// views
import Home from './View/Home';

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

/*
 * ## Component Declaration
 */
class ExpenseTracker extends Component<{}, {}, State> {

  /*
   * ### ExpenseTracker.getStores()
   * Creates the two-way Flux binding with the returned stores
   *
   * @return {Array}  the stores to keep track of in state
   */
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

  /*
   * ### ExpenseTracker.calculateState()
   * Determines the current state of the component.
   *
   * @param  {State}  prevState   the previous component state
   * @return {Object}             the current state of the component
   */
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

  /*
   * ### ExpenseTracker.componentDidMount()
   * A React life-cycle method called once the component is mounted in the DOM.
   *
   * @see http://git.io/v8ngk
   *
   * @return {void}
   */
  componentDidMount(): void {

    // This event starts initializing the various stores
    dispatch({
      type: 'app/initialize',
    });

    // Initializes the view
    Aviator.refresh();
  }

  /*
   * ### ExpenseTracker.render()
   * Called when the component is rendered into the DOM.
   *
   * @see https://facebook.github.io/react/docs/component-specs.html#render
   *
   * @return {ReactElement}   the markup (as React Elements) to be rendered
   */
  render(): ReactElement {

    /*
     * Start out by determining whether or not the user has logged in (using
     * OAuth via hello.js) and creating a flag for it.
     */
    const isLoggedIn = !!this.state.appState.getIn(['oauth', 'user']);

    /*
     * Next, determine classes for the container. We add a `loading` class if
     * a store is in the middle of doing a vital async request (which is any
     * async request that will provide non-optional data, such as the user's
     * info or groups).
     */
    const containerClasses = classnames({
      'expense-tracker': true,
      loading: this._isStoreDataLoading(),
    });

    /*
     * All components rendered will be added to this array, which makes it a
     * bit easier to track what's happening since there's a lot going on in
     * this component.
     */
    const components = [];

    if (isLoggedIn) {

      // If the user's logged in, render the view according to the given route.
      components.push(this._renderView());

      // TODO Mive navigation to its own component
      components.push(
        <ul key="app-nav" className="nav">{getNavigation(this._navigate)}</ul>
      );
    } else {

      // Show the login screen if the user isn't logged in.
      components.push(<Auth appState={this.state.appState} />);
    }

    /*
     * After we've collected all the required components in an array, return
     * that array inside a container div for display.
     */
    return (
      <div className={containerClasses}>
        {components}
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

  /*
   * ### ExpenseTracker._renderView()
   * Takes the information from the router and returns the appropriate
   * components for rendering.
   *
   * @return {Array}    an array of components to be rendered
   */
  _renderView() {

    // Create a quick reference to the relevant data for easier access.
    const view = this.state.appState.getIn(['view', 'page']);
    const params = this.state.appState.getIn(['view', 'params']);

    log(`view: ${view}`);
    log(`params: ${params}`);

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

      // TODO Create the home view
      case 'home':
        components.push(
          <Home
            key={`heading-${view}`}
            appState={this.state.appState}
            groups={this.state.groups}
          />
        );
        break;

      // TODO Create the groups view
      case 'groups':
        components.push(<h1 key={`heading-${view}`}>Groups</h1>);
        break;

      // TODO Create the account view
      case 'account':
        components.push(<h1 key={`heading-${view}`}>Account</h1>);
        break;

      // TODO Create the expense view
      case 'expenses':
        components.push(<h1 key={`heading-${view}`}>Expenses</h1>);
        components.push(<p key={`id-${view}`}>Group ID: {params.group_id}</p>);
        break;

      // TODO Create the category view
      case 'categories':
        components.push(<h1 key={`heading-${view}`}>Categories</h1>);
        components.push(<p key={`id-${view}`}>Group ID: {params.group_id}</p>);
        break;

      // TODO Create the group settings view
      case 'settings':
        components.push(<h1 key={`heading-${view}`}>Group Settings</h1>);
        components.push(<p key={`id-${view}`}>Group ID: {params.group_id}</p>);
        break;

      // By default, show the login component only
      // TODO Create the login screen view
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

  /**
   * ### ExpenseTracker._isStoreDataLoading()
   * Check if any stores are in the process of loading.
   *
   * @return {Boolean} true if any store is loading, false if not
   */
  _isStoreDataLoading(): boolean {
    return !!this.state.people.get('isLoading') ||
           !!this.state.groups.get('isLoading') ||
           !!this.state.expenses.get('isLoading') ||
           !!this.state.categories.get('isLoading');
  }

}

/*
 * ## Pure Helper Functions
 */

// TODO Manage navigation in a more dynamic way
// TODO Make the nav its own component
function getNavigation(callback) {
  return [
    {name: 'Home', uri: '/home', icon: 'home'},
    {name: 'Expenses', uri: '/groups', icon: 'usd'},
    {name: 'Account', uri: '/account', icon: 'cog'},
    /*{name: 'Group Expenses', uri: '/1234/expenses'},
    {name: 'Group Categories', uri: '/1234/categories'},
    {name: 'Group Settings', uri: '/1234/settings'},*/
  ].map(link => {
    const classes = classnames({
      'navigate': true,
      'nav__link': true,
      'active': link.uri === Aviator.getCurrentURI(),
    });

    return (
      <li key={link.uri} className="nav__item">
        <a href={link.uri} className={classes}>
          <i className={`nav__icon fa fa-${link.icon}`} />
          <span className="nav__label">{link.name}</span>
        </a>
      </li>
    );
  });
}

/*
 * This component is a Container (of the Flux Utils variety), which means it
 * has a two-way binding with the stores listed in `getStores()`. This is a
 * shortcut for setting up event emitters explicitly for each store.
 */
const ExpenseTrackerContainer = Container.create(ExpenseTracker);
export default ExpenseTrackerContainer;
