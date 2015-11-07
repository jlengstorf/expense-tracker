/*
 * # Home View
 * The layout component for the home page.
 *
 * @flow
 */
'use strict';

/*
 * ## Dependencies
 */

// libs
import React, {Component} from 'react';
import debug from 'debug';

// debugger
const log = debug('View/Home');

/*
 * ## Component Declaration
 * Since this is a stateless component, we create it with
 */
const Home = ({appState, groups}) => (
  <div className="view home">
    <h1 className="view__headline">
      Welcome back, {appState.getIn(['oauth', 'user']).first_name}!
    </h1>
    <div className="view__panel panel groups">
      <h2 className="panel__headline">
        Choose an Expense Group to View and Edit Expenses
      </h2>
      <ul className="panel__list groups__list">
        {getGroupLinks(groups.valueSeq())}
      </ul>
    </div>
  </div>
);

/*
 * ### Component Props
 */
Home.propTypes = {
  appState: React.PropTypes.object.isRequired,
  groups: React.PropTypes.object.isRequired,
};

/*
 * ### Export the Component
 */
export default Home;

/*
 * ## Pure Helper Functions
 */
function getGroupLinks(groups) {
  return groups.map(group => (
    <li key={group.id} data-id={group.id} className="groups__item">
      <a
        className="navigate groups__link"
        href={`/${group.slug}/expenses`}
      >
        {group.name}
      </a>
    </li>
  ));
}
