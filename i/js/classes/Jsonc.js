(function(O2m, d){
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

  O2m.Jsonc = Jsonc;
}(window.O2m, document));