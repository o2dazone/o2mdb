(function(o2, d){
  'use strict';

  var pagination = o2.Pagination.getInstance(),
      results = o2.Results.getInstance(),
      historyC = o2.History.getInstance();

  var SearchFactory = function() {
    var $ = o2.$;

    // search box submit delegators
    $('searchField').addEventListener('submit', function(e){
      e.preventDefault();
      query();
    }, 0);


    function getFilter() {
      var filter = $('dropSelect');
      var filterParam = (filter.dataset.select) ? filter.dataset.select + ':' : '';
      return filterParam;
    }

    var searchQuery,
        defaultSearch = 'http://o2dazone.com/music/search/';

    function query() {
      searchQuery = getFilter() + $('search').value;
      d.querySelectorAll('#results > p')[0].innerHTML = ''; //clear the resultCount box when a new query is done

      if (searchQuery === '')
        return;

      pagination.reset();
      o2.musicAjaxCall = defaultSearch + searchQuery;
      results.publish();
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




