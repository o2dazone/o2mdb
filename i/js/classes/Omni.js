(function(o2, d, w){
  'use strict';

  var search = o2.Search.getInstance();

  (function() {
    var $ = o2.$;

    var omniSearch = $('omniSearchForm') || null;

    if (omniSearch) {
      omniSearch.addEventListener('submit', function(e){
        e.preventDefault();
        $('search').value = $('omniSearch').value;
        search.query();
      });
    }
  }());
}(window.o2, document, window));