const conf = require('./webpack.shared');
const prod = Object.assign(conf('production'), {
    mode: 'production'
});
module.exports = prod;

/**
 * INITIAL WEBPACK 4 CHUNK SPLITTING
 * Since this is a relativly small SPA it's much more efficient to get all scripts at once via defer.
 * SSR takes care of initial rendering
 * optimization: {
 *       splitChunks: {
 *           cacheGroups: {
 *               commons: {
 *                   test: /[\\/]node_modules[\\/]/,
 *                   name: 'vendor',
 *                   chunks: 'all',
 *                   enforce: true
 *               }
 *           }
 *       }
 *   }
 */
