(function(o2, d){
  'use strict';

  var Dropdown = function(id) {
    var self = this;

    if (!(self instanceof Dropdown))
      return new Dropdown(id);

    self.el = d.getElementById(id);

    function show() {
      self.el.setAttribute('data-shown',true);
      self.el.removeAttribute('class');
    }

    function hide() {
      if (self.el.dataset.shown) {
        self.el.removeAttribute('data-shown');
        self.el.className = 'hidden';
      }
    }

    return {
      show: show,
      hide: hide
    };
  };

  o2.Dropdown = Dropdown;
}(window.o2, document));