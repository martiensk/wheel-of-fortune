const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('mini-css-extract-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

/**
 * @param {string} env The node environment as a string.
 * @param {boolean} ssr If true, webpack will deploy assets for server-side rendering.
 * @returns {object} A webpack configuration based on the supplied environment string.
 */
module.exports = (env, ssr = false) => {
    return {
        entry: ['core-js/fn/promise', './scripts/entry.client.js'],
        output: {
            filename: env === 'development' ? 'js/[name].js' : 'js/[chunkhash].js',
            path: env === 'development' ? path.resolve(__dirname, 'build') : path.resolve(__dirname, 'dist')
        },
        module: {rules: getRules(env)},
        resolve: {
            extensions: ['.js', '.vue', '.scss'],
            alias: {
                TextPlugin: path.resolve(__dirname, './scripts/vendor/TextPlugin.min.js'),
                MorphSVG: path.resolve(__dirname, './scripts/vendor/MorphSVGPlugin.min.js')
            }
        },
        plugins: getPlugins(env, ssr)
    };
};

/**
 * @param {string} env The node environment as a string.
 * @returns {object} A set of rules based on the node environment.
 */
const getRules = (env) => {
    const rules = [
        {
            enforce: 'pre',
            test: /\.(js|vue)$/,
            loader: 'eslint-loader',
            options: {
                formatter: require('eslint-friendly-formatter'),
                emitWarning: true,
                fix: true
            }
        },
        {
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
                loaders: {js: 'babel-loader'},
                cssModules: {minimize: env !== 'development'}
            }
        },
        {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {loader: 'babel-loader'}
        },
        {
            test: /\.scss$/,
            loader: 'sass-loader',
            options: {sourceMap: env === 'development'}
        },
        {
            test: /\.(png|svg|jpg|gif)$/,
            use: [{
                loader: 'file-loader',
                options: {
                    name: env === 'development' ? '[name].[ext]' : '[hash].[ext]',
                    outputPath: 'images/',
                    publicPath: '/'
                }
            }]
        },
        {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            use: [{
                loader: 'file-loader',
                options: {
                    name: env === 'development' ? '[name].[ext]' : '[hash].[ext]',
                    outputPath: 'fonts/',
                    publicPath: '/'
                }
            }]
        },
        {
            test: /\.(mp3|ogg)$/,
            use: [{
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'audio/',
                    publicPath: '/'
                }
            }]
        }
    ];

    const devRules = [
        {
            enforce: 'post',
            test: /\.scss$/,
            use: [
                {loader: 'style-loader'},
                {
                    loader: 'css-loader',
                    options: {sourceMap: true}
                },
                {
                    loader: 'postcss-loader',
                    options: {sourceMap: true}
                }
            ]
        }
    ];

    const prodRules = [
        {
            enforce: 'post',
            test: /critical.scss/,
            use: [
                {
                    loader: ExtractTextPlugin.loader,
                    options: {publicPath: '/'}
                },
                {
                    loader: 'css-loader',
                    options: {
                        minimize: true,
                        importLoaders: 1
                    }
                },
                {loader: 'postcss-loader'}
            ]
        },
        {
            enforce: 'post',
            test: /main.scss/,
            use: [
                {
                    loader: ExtractTextPlugin.loader,
                    options: {publicPath: '/'}
                },
                {
                    loader: 'css-loader',
                    options: {
                        minimize: true,
                        importLoaders: 1
                    }
                },
                {loader: 'postcss-loader'}
            ]
        }
    ];

    return env === 'development' ? rules.concat(devRules) : rules.concat(prodRules);
};

/**
 * @param {string} env The node environment as a string.
 * @returns {object} An object containing plugins to be included in the webpack build.
 */
const getPlugins = (env) => {
    const pluginPack = [
        new webpack.LoaderOptionsPlugin({options: {}}),
        new StyleLintPlugin({
            fix: env !== 'development',
            configOverrides: {
                rules: env === 'development' ? {} : {
                    'order/order': [
                        'dollar-variables',
                        'declarations',
                        'at-rules',
                        'rules'
                    ],
                    'order/properties-alphabetical-order': true
                }
            }
        }),
        new HtmlWebpackPlugin({
            title: 'Coming Soon',
            filename: 'views/index.html',
            template: './views/index.html',
            favicon: 'favicon.ico',
            inject: false,
            minify: {
                collapseBooleanAttributes: true,
                collapseInlineTagWhitespace: true,
                collapseWhitespace: true
            }
        })
    ];

    if (env === 'development') {
        pluginPack.push(new CleanWebpackPlugin(['build']));
    } else {
        pluginPack.push(new CleanWebpackPlugin(['dist']));
        pluginPack.push(new ExtractTextPlugin({
            filename: 'css/[contenthash].css',
            allChunks: true
        }));
        pluginPack.push(new BundleAnalyzerPlugin());
    }

    return pluginPack;
};
