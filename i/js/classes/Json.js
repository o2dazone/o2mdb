(function(w,d, o2){
  'use strict';

  o2.fn.json = (function(){

    function toStr(arg) {
      return encodeURI(JSON.stringify(arg));
    }

    function toObj(arg) {
      return JSON.parse(decodeURI(arg));
    }

    function get(url, callback){
      var ajax = new XMLHttpRequest();
      ajax.onreadystatechange = function(){
        if(ajax.readyState === 4 && ajax.status !== 404){
          var r = ajax.response;
          // parse to json if "string" json
          if (r.match(/^(\[|\{)/)) {
            r = JSON.parse(r);
          }

          callback(r);
        }
      };

      ajax.open('GET', url, !0);
      ajax.send();
    }

    function post(url, data, callback) {
      var r = new XMLHttpRequest();
      r.open("POST", url, true);
      r.onreadystatechange = function () {
        if (r.readyState != 4 || r.status != 200) return;
        console.log(r.responseText);
      };
      r.send(data);
    }

    return {
      toStr: toStr,
      toObj: toObj,
      get: get,
      post: post
    };

  }());

}(window, document, window.o2));
