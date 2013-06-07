(function(o2, d, wh){
  'use strict';

  var HistoryFactory = function(id) {
    var self = this;

    function writeHistory(name, param) {
      wh.replaceState('searchResults', name, param);
    }

    return {
      writeHistory: writeHistory
    };
  };

  var instances = {};

  function getInstance(name) {
    if (!instances[name]) {
      instances[name] = new HistoryFactory(name);
    }

    return instances[name];
  }

  o2.History = {
    getInstance: getInstance
  };
}(window.o2, document, window.history));