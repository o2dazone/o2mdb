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


/* stuff for auto generate playlist from local storage
o2.$('playlistScroll').innerHTML = ls_playlist;
if (!isShowing()) {
  $('playlist').style.opacity = '1';
  if (songC.isPlaying()) {
    songC.playSong();
    w.location = '#play';
    return true;
  }
}

*/