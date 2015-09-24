var webpack = require('webpack');

module.exports = {
    entry: "./i/js/app.js",
    output: {
        path: __dirname,
        filename: "bundle.js",
        publicPath: 'http://localhost:8090/assets'
    },
    module: {
      loaders: [
        {
          //tell webpack to use jsx-loader for all *.jsx files
          test: /\.jsx$/,
          loader: 'jsx-loader?insertPragma=React.DOM&harmony'
        }
      ]
    },
    resolve: {
      extensions: ['', '.js', '.jsx']
    },
    plugins: [
      new webpack.ProvidePlugin({
          React: "react"
      })
    ]
};