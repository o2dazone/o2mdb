(function(o2, d, w){
  'use strict';

  (function() {
    var $ = o2.$;

    var omniSearch = $('omniSearchForm') || null;

    if (omniSearch) {
      omniSearch.addEventListener('submit', function(e){
        e.preventDefault();
        $('search').value = $('omniSearch').value;
        o2.Search.getInstance().query();
      });
    }
  }());
}(window.o2, document, window));