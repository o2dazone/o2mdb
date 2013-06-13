(function(o2, d, w){
  'use strict';

  var omniFactory = function() {
    var $ = o2.$;

    var omniShown = document.getElementById('omni') ? true : false; // does this object exist? assign to boolean
    /*
    * is omni on the dom? dynamically check this value
    */
    function hide() {
      if (omniShown) {
        omniShown = false;
        $('omni').style.opacity = 0; //fade out
        omniSearch.removeEventListener('submit'); //remove submit event
        setTimeout(function(){
          $('omni').parentNode.removeChild($('omni')); //remove from dom
        },500);
      }
    }

    /*
    * if the omni search box is on the dom, bind an event to it.
    */
    if (omniShown) {
      $('omniSearchForm').addEventListener('submit', function(e){
        e.preventDefault();
        $('search').value = $('omniSearch').value;
        o2.Search.getInstance().query();
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