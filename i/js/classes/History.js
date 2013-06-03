(function(o2, d, wh){
  'use strict';

  var History = function(id) {
    var self = this;

    function writeHistory(name, param) {
      wh.replaceState('searchResults', name, param);
    }

    return {
      writeHistory: writeHistory
    };
  };

  o2.History = History;
}(window.o2, document, window.history));