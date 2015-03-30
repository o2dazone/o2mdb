var o2 = require('../o2mdb.js'),
    json = require('./Json.js'),
    $ = o2.$,
    _ = o2._,
    count = null, playing;

module.exports = {

  counter: function(num) {
    if (!count) count = document.querySelectorAll('queue songs song').length;
    else count += (!num) ? 1 : num;
    $('queue sectionhead').innerHTML = 'You have '+ count + ' songs in your queue.';
  }

};

