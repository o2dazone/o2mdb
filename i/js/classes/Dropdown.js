(function(O2m, d){
  'use strict';

  var Dropdown = function(id) {
    var self = this;

    if (!(self instanceof Dropdown))
      return new Dropdown(id);

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

  O2m.Dropdown = Dropdown;
}(window.O2m, document));