(function(o2, d, w){
  'use strict';

  var search = o2.Search.getInstance();

  (function() {
    var self = this,
        $ = o2.$;

    if (!w.location.href.match(/\?/)) {
      $('omni').style.display = 'block';

      $('omniSearchForm').addEventListener('submit', function(e){
        e.preventDefault();
        $('search').value = $('omniSearch').value;
        search.query();
      });
    }
  }());
}(window.o2, document, window));