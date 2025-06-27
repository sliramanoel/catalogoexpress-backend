const nodeExternals = require('webpack-node-externals');

module.exports = {
  target: 'node',
  externals: [nodeExternals()],
  entry: './index.js',
  output: {
    path: __dirname,
    filename: 'bundle.js'
  }
};
