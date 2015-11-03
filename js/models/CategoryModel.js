'use strict';

// libs
import uuid from 'uuid';
import {Record} from 'immutable';

const CategoryRecord = Record({
  id: undefined,
  group: undefined,
  name: undefined,
  icon: undefined,
  split: undefined,
});

export default class Category extends CategoryRecord {
  id: string;
  group: string;
  name: number;
  icon: string;
  split: array;

  constructor(category: object) {
    super({

      // id: uuid.v4(),
      id: category.id,
      group: category.group,
      name: category.name,
      icon: category.icon,
      split: category.split,
    });
  }
}
