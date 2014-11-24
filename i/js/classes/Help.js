(function(w,d, o2){
  'use strict';

  var $ = o2.$,
      fn = o2.fn;

  fn.help = (function(){

    function show() {
      if (!fn.cookie.get('shownHelp')) {
        $('help').removeAttribute('hide');
      }
    }

    function init() {
      show();
    }

    function close() {
      $('help').setAttribute('hide','');
      fn.cookie.set('shownHelp',true);
    }

    init();

    return {
      close: close
    }

  }());

}(window, document, window.o2));
