var Logo = require('./logo');
var Search = require('./search');

'use strict'

module.exports = React.createClass({
    displayName: 'header',
    render: function(){
        return (
          <header>
            <Logo />
            <Search />
          </header>
        )
    }
})

