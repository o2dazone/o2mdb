(function(o2, d){
  'use strict';

  var PaginationFactory = function() {
    var page = 0, search, results = null;

    function pageAround() {
      if (!results) { //adhoc define results and search instances
        results = o2.Results.getInstance();
        search = o2.Search.getInstance();
      }
      results.publishToResults(search.getLastQuery() + '/page/' + page);
    }

    function previousPage() {
      if (page > 0) {
        page--;
        pageAround();
      }
    }

    function nextPage() {
      page++;
      pageAround();
    }

    function reset() {
      page = 0;
    }

    var addAll, showPrev, showNext;
    function paging(len) {
      addAll = [],
      showPrev = '',
      showNext = '';

      if (page > 0) showPrev = '<a class="prev" data-el="prevPage" href="#">Prev Page</a>';
      if (len >= 100) showNext = '<a class="next" data-el="nextPage" href="#">Next Page</a>';

      if (len > 0) {
        addAll.push('<span><a href="#" class="addAll" data-el="addAllResults">Add all these results to your playlist</a>');

        addAll.push(showPrev);
        addAll.push(showNext);

        addAll.push('</span>');
      }

      return addAll.join('');
    }

    return {
      previousPage: previousPage,
      nextPage: nextPage,
      paging: paging,
      reset: reset
    };
  };

  var instances = {};

  function getInstance(name) {
    if (!instances[name]) {
      instances[name] = new PaginationFactory(name);
    }

    return instances[name];
  }

  o2.Pagination = {
    getInstance: getInstance
  };
}(window.o2));






