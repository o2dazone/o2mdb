(function(o2, d){
  'use strict';

  var pagination = o2.Pagination.getInstance(),
      results = o2.Results.getInstance(),
      historyC = o2.History.getInstance();

  var SearchFactory = function() {
    var $ = o2.$;

    function getFilter() {
      var filter = $('dropSelect');
      var filterParam = (filter.dataset.select) ? filter.dataset.select + ':' : '';
      return filterParam;
    }

    var searchQuery;

    function query() {
      searchQuery = getFilter() + $('search').value;
      d.querySelectorAll('#results > p')[0].innerHTML = ''; //clear the resultCount box when a new query is done

      if (searchQuery === '')
        return;

      pagination.reset();
      o2.musicAjaxCall = o2.defaultSearch + searchQuery;
      results.publishToResults();

      if (window.location.href.indexOf('&p=') === -1) // if there is no 'play' query, then do a search query
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




