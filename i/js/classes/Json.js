(function(w,d, o2){
  'use strict';

  o2.fn.json = (function(){

    function toStr(arg) {
      return encodeURI(JSON.stringify(arg));
    }

    function toObj(arg) {
      return JSON.parse(decodeURI(arg));
    }

    function get(url, callback, onfail){
      var ajax = new XMLHttpRequest();
      ajax.onreadystatechange = function(){
        if(ajax.readyState === 4) {
          if(ajax.status < 400) { // lol ghetto 404 or 500 check
            var r = ajax.response;
            // parse to json if "string" json
            if (r.match(/^(\[|\{)/)) {
              r = JSON.parse(r);
            }

            callback(r);
          } else onfail();
        }
      };

      ajax.open('GET', url, !0);
      ajax.send();
    }

    return {
      toStr: toStr,
      toObj: toObj,
      get: get
    };

  }());

}(window, document, window.o2));
