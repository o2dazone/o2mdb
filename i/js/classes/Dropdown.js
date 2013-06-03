(function(o2, d){
  'use strict';

  var Dropdown = function(id) {
    var self = this;

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

  o2.Dropdown = Dropdown;
}(window.o2, document));