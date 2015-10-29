/* @flow */
'use strict';

// libs
import React, {Component} from 'react';
import {Map} from 'immutable';
import debug from 'debug';

// debugger
const log = debug('components/Form/Input');

// types
type Props = {
  label: ?string,
  name: string,
  inputClass: ?string,
  type: ?string,
  pattern: ?string,
  placeholder: ?string,
  value: ?string,
  changeHandler: ?(event: SyntheticEvent) => void,
  keyDownHandler: ?(event: SyntheticEvent) => void,
};

type State = {
  value: number,
};

export default class Input extends Component<{}, Props, State> {

  constructor(props: Props): void {
    super(props);

    this.state = {
      value: this.props.value,
    };
  }

  render() {
    const {
      label,
      name,
      inputClass,
      type,
      pattern,
      placeholder,
      changeHandler,
      keyDownHandler,
    } = this.props;

    return (
      <div className="form__input">
        {label && (<label htmlFor={name}>{label}</label>)}
        <input
          id={name}
          name={name}
          className={inputClass}
          type={type || 'text'}
          pattern={pattern}
          placeholder={placeholder}
          defaultValue={this.state.value}
          onChange={changeHandler}
          onKeyDown={keyDownHandler}
        />
      </div>
    );
  }

}
