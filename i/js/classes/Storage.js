var data;

function set(key, value) {
  sessionStorage.setItem(key, value);
}

function get(key, callback) {
  if ((data = sessionStorage.getItem(key))) {
    if (callback)
      callback(data);

    return true;
  }
  return false;
}

module.exports = {

  get: get ,

  set: set

};
