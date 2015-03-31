var o2 = require('../o2mdb.js'),
    json = require('./Json.js'),
    $ = o2.$,
    _ = o2._,
    count = null, playing;

function counter(num) {
  if (!count) count = document.querySelectorAll('queue songs song').length;
  else count += (!num) ? 1 : num;
  $('queue sectionhead').innerHTML = 'You have '+ count + ' songs in your queue.';
}

module.exports = {
  counter: counter
};

