var $ = require('../o2mdb.js').$,
    cookie = require('./Cookie.js');

function show() {
  if (!cookie.get('shownHelp')) {
    $('help').removeAttribute('hide');
  }
}

function init() {
  show();
}

function close() {
  $('help').setAttribute('hide','');
  cookie.set('shownHelp',true);
}

module.exports = {
  show: show,
  init: init,
  close: close
};


