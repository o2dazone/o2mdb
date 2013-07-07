(function(o2, d){
  'use strict';

  var StorageFactory = function() {

    var data;
    function get(key, callback) {
      if ((data = sessionStorage.getItem(key))) {
        if (callback)
          callback(data);

        return true;
      }
      return false;
    }

    function set(key, value) {
      sessionStorage.setItem(key, value);
    }

    return {
      get: get,
      set: set
    };
  };

  var instances = {};

  function getInstance(name) {
    if (!instances[name]) {
      instances[name] = new StorageFactory(name);
    }

    return instances[name];
  }

  o2.Storage = {
    getInstance: getInstance
  };
}(window.o2));