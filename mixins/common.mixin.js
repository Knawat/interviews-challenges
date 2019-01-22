module.exports = {
  methods: {
    getTimeStamp(date) {
      return Math.floor(date / 1000);
    },
    isEmpty(obj) {
      // null and undefined are "empty"
      if (obj == null) return true;

      if (Object.keys(obj).length && Object.keys(obj).length > 0) return false;
      if (Object.keys(obj).length === 0) return true;

      return true;
    },
    getKeyByValue(object, value) {
      return Object.keys(object).find(key => object[key] === value);
    },
    getTrim(value) {
      return value.toString().trim();
    },
    async asyncForEach(array, callback, thisArg) {
      const promiseArray = [];
      for (let i = 0; i < array.length; i += 1) {
        if (i in array) {
          const p = Promise.resolve(array[i]).then(currentValue =>
            callback.call(thisArg || this, currentValue, i, array)
          );
          promiseArray.push(p);
        }
      }
      await Promise.all(promiseArray);
    }
  }
};
