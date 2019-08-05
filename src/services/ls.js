const Storage = window.localStorage;

function localStorageExpires() {
  let toRemove = [],                      // Items to remove
    currentDate = new Date().getTime();  // Current date in milliseconds

  for (let i = 0, j = Storage.length; i < j; i++) {
    let current = Storage.getItem(Storage.key(i));

    // Check item format to avoid conflict with other applications
    if (current && /^\{(.*?)\}$/.test(current)) {

      // Decode back to JSON
      current = JSON.parse(current);

      // Checks the expires key of the specified item if it is older than the current date it saves in the array
      if (current.expires && current.expires <= currentDate) {
        toRemove.push(Storage.key(i));
      }
    }
  }

  // Remove items that are past time
  // If removing in the first loop this could affect the order,
  // because when you remove an item usually the object or array is reordered
  for (let i = toRemove.length - 1; i >= 0; i--) {
    Storage.removeItem(toRemove[i]);
  }
}

export const ls = {
  async set(lastname = '', value = {}, time = null) {
    let json = {};

    if (time) {
      let expirarem = (new Date().getTime()) + (60000 * time);

      json = JSON.stringify({value: value, expires: expirarem});
    } else {
      json = JSON.stringify({value: value});
    }

    await Storage.setItem(lastname, json);
  },
  get(lastname) {
    localStorageExpires();  //Cleans items

    let itemValue = Storage[lastname];

    if (itemValue && /^\{(.*?)\}$/.test(itemValue)) {

      // Decode back to JSON
      let current = JSON.parse(itemValue);

      return current.value;
    }

    return false;
  },
  getAll() {
    let local = [];

    for (let i = 0, len = Storage.length; i < len; ++i) {
      let itemKey = Storage.key(i);

      let itemValue = Storage.getItem(itemKey);

      // Decode back to JSON
      let pushValue = JSON.parse(itemValue);

      // Saving to local array
      local.push(pushValue.value);
    }

    return local
  },
  remove(lastname) {
    // Remove Item from Passed Key
    Storage.removeItem(lastname);
  },
  clear() {
    // Remove all
    Storage.clear();
  }
};
