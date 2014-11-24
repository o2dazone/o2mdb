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
      var cookieDate = new Date;
      cookieDate.setFullYear(cookieDate.getFullYear( ) +10);
      document.cookie = key + '=' + value +';expires='+ cookieDate +';path=/';
    }

    return {
      get: get,
      set: set
    };

  }());

}(window, document, window.o2));


