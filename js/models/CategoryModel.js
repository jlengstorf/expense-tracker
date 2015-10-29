'use strict';

// libs
import uuid from 'uuid';
import {Record} from 'immutable';

const CategoryRecord = Record({
  id: undefined,
  name: undefined,
  icon: undefined,
  split: undefined,
});

export default class Category extends CategoryRecord {
  id: string;
  name: number;
  icon: string;
  split: array;

  constructor(category: object) {
    super({

      // id: uuid.v4(),
      id: category.id,
      name: category.name,
      icon: category.icon,
      split: category.split,
    });
  }
}
