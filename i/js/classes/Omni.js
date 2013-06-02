(function(o2, d, w){
  'use strict';


  var Omni = function() {
    var self = this,
        $ = o2.$;

    if (!(self instanceof Omni))
      return new Omni();

    if (!w.location.href.match(/\?/)) {
      $('omni').style.display = 'block';

      $('omniSearchForm').addEventListener('submit', function(e){
        e.preventDefault();
        $('search').value = $('omniSearch').value;
        self.Search.query();
      });
    }
  };

  o2.Omni = Omni;
}(window.o2, document, window));