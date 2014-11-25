(function(w,d, o2){
  'use strict';

  var fn = o2.fn;

  fn.errors = (function(){

    var errs;
    function sendError(err) {
      errs = {
        'error': err[0],
        'file': err[1],
        'line': err[2]
      };

      fn.json.post('/errors', JSON.stringify(errs));
    }

    function init() {
      window.onerror = function() {
        sendError(arguments);
        return true;
      };
    }


    init();

  }());

}(window, document, window.o2));
