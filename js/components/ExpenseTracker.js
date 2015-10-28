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
import ExpenseStore from '../stores/ExpenseStore';
import CategoryStore from '../stores/CategoryStore';
import PersonStore from '../stores/PersonStore';
import SpendingStore from '../stores/SpendingStore';
import DebtStore from '../stores/DebtStore';

// dispatcher
import {dispatch} from '../dispatcher';

// debugger
const log = debug('components/ExpenseTracker');

type State = {
  expenses: Immutable.Map,
};

class ExpenseTracker extends Component<{}, {}, State> {

  static getStores(): Array<Store> {
    return [
      ExpenseStore,
      CategoryStore,
      PersonStore,
      SpendingStore,
      DebtStore,
    ];
  }

  static calculateState(prevState: ?State): State {
    return {
      expenses: ExpenseStore.getState(),
      categories: CategoryStore.getState(),
      people: PersonStore.getState(),
      spending: SpendingStore.getState(),
      debts: DebtStore.getState(),
    };
  }

  render(): ?ReactElement {
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

      log(splits);
      categories[category.id] = (
        <p key={category.id}>
          Category: {category.name} ({splits.join(', ')})
        </p>
      );
    });

    return (
      <div>
        <h1>Expense Tracking App</h1>
        <Add
          categories={this.state.categories}
          people={this.state.people}
        />
        <Expenses
          expenses={this.state.expenses}
          categories={this.state.categories}
          people={this.state.people}
        />
        <Total expenses={this.state.expenses} />
        <Debts debts={this.state.debts} people={this.state.people} />
      </div>
    );
  }

}

const ExpenseTrackerContainer = Container.create(ExpenseTracker);
export default ExpenseTrackerContainer;
