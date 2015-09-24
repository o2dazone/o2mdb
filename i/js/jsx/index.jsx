'use strict'

var Header = require('./header');
var Container = require('./container');
var Footer = require('./footer');

React.render((

  <div>
    <Header />
    <Container />
    <Footer />
  </div>

), document.querySelector('body'));
