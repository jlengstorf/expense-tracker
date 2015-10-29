'use strict';

import {Map} from 'immutable';

export default {
  bootstrap: (tempRecords, RecordType) => {
    console.warn('Bootstrapping data means changes are lost after each save!');
    const records = Map();

    let dataArrays = [];
    tempRecords.forEach((record, index) => {
      const newRecord = new RecordType(record);
      const currArr = dataArrays.length ? dataArrays[index - 1] : records;

      dataArrays[index] = currArr.set(newRecord.id, newRecord);
    });

    return dataArrays.pop();
  },

  /**
   * Some stores need to be rebuilt on every change, so this resets them
   * @return {State} An empty immutable map to replace the current state
   */
  reset: () => Map(),
};
