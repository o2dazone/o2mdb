// fn.cookie.set('foo','bar');
// console.log(fn.cookie.get('foo'));

(function(w,d, o2){
  'use strict';

  o2.fn.cookie = (function(){

    function get(key) {
      var re = new RegExp('[; ]'+key+'=([^\\s;]*)');
      var sMatch = (' '+document.cookie).match(re);
      if (key && sMatch) return unescape(sMatch[1]);
      return '';
    }

    function set(key, value) {
      document.cookie = key + '=' + value;
    }

    return {
      get: get,
      set: set
    };

  }());

}(window, document, window.o2));


