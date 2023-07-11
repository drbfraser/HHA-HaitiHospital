const path = require('path');

module.exports = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        include: [
          path.resolve(__dirname, 'src'), // Include your project's source code
          path.resolve(__dirname, 'node_modules/@hha/common'), // Include @hha/common package
        ],
        use: 'ts-loader',
      },
      // Other rules...
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
};
