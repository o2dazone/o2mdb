// cookie.set('foo','bar');
// console.log(cookie.get('foo'));

function get(key) {
  var re = new RegExp('[; ]'+key+'=([^\\s;]*)');
  var sMatch = (' '+document.cookie).match(re);
  if (key && sMatch) return unescape(sMatch[1]);
  return '';
}

function set(key, value) {
  var cookieDate = new Date;
  cookieDate.setFullYear(cookieDate.getFullYear( ) +10);
  document.cookie = key + '=' + value +';expires='+ cookieDate +';path=/';
}

module.exports = {
    get: get,
    set: set
};


