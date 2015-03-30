var data;

module.exports = {

  get: function(key, callback) {
    if ((data = sessionStorage.getItem(key))) {
      if (callback)
        callback(data);

      return true;
    }
    return false;
  },

  set: function(key, value) {
    sessionStorage.setItem(key, value);
  }

};
