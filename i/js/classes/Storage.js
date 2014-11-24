(function(w,d, o2){
  'use strict';

  o2.fn.storage = (function(){

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

  }());

}(window, document, window.o2));
