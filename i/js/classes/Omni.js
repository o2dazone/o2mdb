(function(O2m, d, w){
  'use strict';

  var Omni = function() {
    var self = this,
        $ = O2m.$;

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

  O2m.Omni = Omni;
}(window.O2m, document, window));