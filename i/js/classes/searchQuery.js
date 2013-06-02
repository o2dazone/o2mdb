(function(o2, d){
  'use strict';

  var Search = function() {
    var self = this,
        $ = o2.$;

    if (!(self instanceof Search))
      return new Search();

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

    function query(callback) {
      searchQuery = getFilter() + $('search').value;
      d.querySelectorAll('#results > p')[0].innerHTML = ''; //clear the resultCount box when a new query is done

      if (searchQuery === '')
        return;

      self.musicAjaxCall = defaultSearch + searchQuery;
      self.pagination.reset();
      self.publishResults();
      self.History.writeHistory(searchQuery, '?s=' + searchQuery);
    }

    return {
      query: query
    };
  };

  o2.Search = Search;
}(window.o2, document));




