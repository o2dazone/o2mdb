(function(o2, d){
  'use strict';

  var JsoncFactory = function() {
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
  };

  var instances = {};

  function getInstance(name) {
    if (!instances[name]) {
      instances[name] = new JsoncFactory(name);
    }

    return instances[name];
  }

  o2.Jsonc = {
    getInstance: getInstance
  };
}(window.o2, document));