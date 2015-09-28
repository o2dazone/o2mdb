'use strict'


require('../polyfill/map.js');

var Header = require('./header');
var Container = require('./container');
var Footer = require('./footer');

React.render((

  <div id="app">
    <Header />
    <Container />
    <Footer />
  </div>

), document.querySelector('body'));
