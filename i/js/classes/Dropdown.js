(function(o2, d){
  'use strict';

  var instances = {};

  var DropdownFactory = function(id) {
    var el = d.getElementById(id);

    function show() {
      el.setAttribute('data-shown',true);
      el.removeAttribute('class');
    }

    function hide() {
      if (el.dataset.shown) {
        el.removeAttribute('data-shown');
        el.className = 'hidden';
      }
    }

    return {
      show: show,
      hide: hide
    };
  };

  function getInstance(id) {
    if (!instances[id]) {
      instances = new DropdownFactory(id);
    }

    return instances;
  }

  o2.Dropdown = {
    getInstance: getInstance
  };
}(window.o2, document));
