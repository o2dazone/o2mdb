(function(o2, d, w){
  'use strict';

  (function() {
    var $ = o2.$;

    var omniSearch = $('omniSearchForm') || null;

    function hideOmnibox() {
      if (document.getElementById('omni')) {
        $('omni').style.opacity = 0;
        setTimeout(function(){
          $('omni').parentNode.removeChild($('omni'));
        },500);
      }
    }

    if (omniSearch) {
      omniSearch.addEventListener('submit', function(e){
        e.preventDefault();
        $('search').value = $('omniSearch').value;
        o2.Search.getInstance().query();

        hideOmnibox();
      });
    }
  }());
}(window.o2, document, window));