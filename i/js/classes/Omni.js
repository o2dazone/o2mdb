(function(o2, d, w){
  'use strict';

  var omniFactory = function() {
    var $ = o2.$;

    var omniSearch = $('omniSearchForm') || null;

    function hide() {
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

        hide();
      });
    }

    return {
      hide: hide
    };
  };

  var instances = {};

  function getInstance(name) {
    if (!instances[name]) {
      instances[name] = new omniFactory(name);
    }

    return instances[name];
  }

  o2.Omni = {
    getInstance: getInstance
  };
}(window.o2, document, window));