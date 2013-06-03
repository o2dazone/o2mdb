(function(O2m, d, wh){
  'use strict';

  var History = function(id) {
    var self = this;

    if (!(self instanceof History))
      return new History();

    function writeHistory(name, param) {
      wh.replaceState('searchResults', name, param);
    }

    return {
      writeHistory: writeHistory
    };
  };

  O2m.History = History;
}(window.O2m, document, window.history));