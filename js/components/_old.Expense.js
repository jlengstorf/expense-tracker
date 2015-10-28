// libs
import React, {Component, PropTypes} from 'react';
import classnames from 'classnames';
import debug from 'debug';

// actions
import Actions from '../actions';

// debug logger
const log = debug('components/Expense');

// constants
const EXPENSE_CLASS = 'expense';

/**
 * Markup for an individual expense
 */
class Expense extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {id, ...other} = this.props;

    return (
      <ul className={EXPENSE_CLASS}>
        {Object.keys(this.props).map(key => {
          if (key === 'id') {
            return;
          }

          const type = typeof this.props[key] === 'number' ? 'number' : 'text';
          return (
            <Expense.Input
              key={key}
              ref={key}
              name={key}
              type={type}
              value={this.props[key]}
              onSave={this._onSave.bind(this)}
            />
          );
        })}
      </ul>
    );
  }

  /**
   * Callback for the save operation on Expense.Input components
   * @param  {object} fieldToUpdate key-value (key is the field name to update)
   * @return {void}
   */
  _onSave(/* object */ fieldToUpdate) {
    log('Saving updated Expense');
    log(fieldToUpdate);

    // Actions.Expenses.update(this.props.id, fieldToUpdate);
  }

}

Expense.propTypes = {
  date: PropTypes.number.isRequired,
  vendor: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  category: PropTypes.number.isRequired,
  paidby: PropTypes.number.isRequired,
};

Expense.Input = class Input extends Component {

  constructor(props) {
    super(props);

    this.state = {
      name: this.props.name,
      value: this.props.value || '',
    };
  }

  render() {
    const classBase = `${EXPENSE_CLASS}__item`;
    const itemClasses = { classBase: true };
    itemClasses[`${classBase}--${this.props.name}`] = true;

    const classes = classnames(itemClasses);

    return (
      <li className={classes}>
        <input
          type={this.props.type}
          name={this.props.name}
          defaultValue={this.state.value}
          className="expense__input"
          onChange={this._onChange.bind(this)}
          onBlur={this._save.bind(this)}
        />
      </li>
    );
  }

  _onChange(event) {
    log('Expense.Input changed.');
    log(event);

    let value = event.target.value;
    if (this.props.type === 'number') {
      value = parseFloat(value);
    }

    this.setState({
      value: value,
    });
  }

  _save() {
    log('Saving Expense.Input');
    log(`{ ${this.state.name}: ${this.state.value} }`);

    this.props.onSave(this.state);
  }

};

Expense.Input.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  name: PropTypes.string.isRequired,
  onSave: PropTypes.func,
  type: PropTypes.oneOf(['text', 'number']),
};

Expense.Input.defaultProps = {
  onSave: () => { log('No onSave callback specified.'); },
};

export default Expense;
