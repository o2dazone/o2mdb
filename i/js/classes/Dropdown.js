(function(o2, d){
  'use strict';

  var DropdownFactory = function(el) {
    el = d.getElementById(el);

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

  var instances = {};

  function getInstance(name) {
    if (!instances[name]) {
      instances = new DropdownFactory(name);
    }

    return instances;
  }

  o2.Dropdown = {
    getInstance: getInstance
  };
}(window.o2, document));