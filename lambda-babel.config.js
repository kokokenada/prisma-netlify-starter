module.exports = {
  module: {
    rules: [
      {
        test: /\.(ts|js)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: [
              "@babel/preset-typescript",
              [
                "@babel/preset-env",
                {
                  "targets": {
                    "node": "10"
                  }
                }
              ]
            ],
            plugins: [
              "@babel/plugin-proposal-class-properties",
              "@babel/plugin-transform-object-assign",
              "@babel/plugin-proposal-object-rest-spread"
            ]
          }
        }
      }
    ]
  }
};