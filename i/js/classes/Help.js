var $ = require('../o2mdb.js').$,
    cookie = require('./Cookie.js');

module.exports = {

  show: function() {
    if (!cookie.get('shownHelp')) {
      $('help').removeAttribute('hide');
    }
  },

  init: function() {
    show();
  },

  close: function() {
    $('help').setAttribute('hide','');
    cookie.set('shownHelp',true);
  }

};


