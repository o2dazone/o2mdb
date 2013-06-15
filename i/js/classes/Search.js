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
    function query() {
      omni.hide();
      searchQuery = getFilter() + $('search').value;
      d.querySelector('#results p').innerHTML = ''; //clear the resultCount box when a new query is done

      pagination.reset();
      results.publishToResults(searchQuery);
      historyC.writeHistory(searchQuery, '?s=' + searchQuery);
    }

    function getLastQuery() {
      return searchQuery;
    }

    return {
      query: query,
      getLastQuery: getLastQuery
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




