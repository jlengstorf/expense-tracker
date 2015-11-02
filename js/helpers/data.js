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

  /**
   * Determines if localStorage is available for the user's browser.
   * @return {Boolean} whether or not localStorage can be used
   */
  isLocalStorageSupported: () => {
    try {
      const storage = window.localStorage;
      const test = '__storage-test__';
      storage.setItem(test, test);
      storage.removeItem(test);
      return true;
    } catch (e) {
      console.warn('localStorage is not supported');
      return false;
    }
  },
};
