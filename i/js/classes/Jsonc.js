(function(o2, d){
  'use strict';

  function Jsonc() {
    function outStr(arg) {
      return encodeURI(JSON.stringify(arg));
    }

    function outObj(arg) {
      return JSON.parse(decodeURI(arg));
    }

    return {
      outStr: outStr,
      outObj: outObj
    };
  }

  o2.Jsonc = Jsonc;
}(window.o2, document));