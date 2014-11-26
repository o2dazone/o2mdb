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
          if(ajax.status !== 404) {
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

    function post(url, data, callback) {
      var ajax = new XMLHttpRequest();
      ajax.open("POST", url, true);
      ajax.onreadystatechange = function () {
        if (ajax.readyState != 4 || ajax.status != 200) return;
      };
      ajax.send(data);
    }

    return {
      toStr: toStr,
      toObj: toObj,
      get: get,
      post: post
    };

  }());

}(window, document, window.o2));
