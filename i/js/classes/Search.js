(function(o2, d){
  'use strict';

  var pagination = o2.Pagination.getInstance(),
      results = o2.Results.getInstance(),
      historyC = o2.History.getInstance(),
      omni = o2.Omni.getInstance();

  var SearchFactory = function() {
    var $ = o2.$;

    function getFilter() {
      var filter = $('dropSelect');
      var filterParam = (filter.dataset.select) ? filter.dataset.select + ':' : '';
      return filterParam;
    }

    var searchQuery;

    function query(url) {
      omni.hide();
      searchQuery = getFilter() + $('search').value;
      d.querySelector('#results p').innerHTML = ''; //clear the resultCount box when a new query is done

      pagination.reset();
      o2.musicAjaxCall = searchQuery;
      results.publishToResults(url);

      historyC.writeHistory(searchQuery, '?s=' + searchQuery);
    }

    return {
      query: query
    };
  };

  var instances = {};

  function getInstance(name) {
    if (!instances[name]) {
      instances[name] = new SearchFactory(name);
    }

    return instances[name];
  }

  o2.Search = {
    getInstance: getInstance
  };
}(window.o2, document));




