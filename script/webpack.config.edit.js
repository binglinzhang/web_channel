const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { CONFIG } = require('../config');

const isDev = process.argv.indexOf('-p') === -1;

const config = {
    entry: {
        edit: './src/edit/index.js',
        page: './src/page/index.js'
    },
    output: {
        path: path.join(process.cwd(), './.build/sdk'),
        publicPath: !isDev ? `${CONFIG.HOST}:${CONFIG.PORT}/sdk` : undefined,
        filename: '[name].js',
        chunkFilename: '[name].js'
    },
    devServer: {
        compress: false,
        port: CONFIG.DEV_SERVER_PORT,
        inline: true,
        open: false,
        hot: true
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    chunks: 'initial',
                    test: /[\\/]node_modules[\\/]/,
                    name: 'commons',
                    priority: 10
                }
            }
        }
    },
    module: {
        rules: [
            {
                test: /\.(gif|jpe?g|png|svg)$/,
                use: {
                    loader: 'file-loader'
                }
            },
            {
                test: /\.(css|less)$/,
                use: [
                    'style-loader',
                    'css-loader?minimize=' + !isDev,
                    'less-loader'
                ]
            },
            {
                test: /\.js$/,
                exclude: [path.join(process.cwd(), './node_modules/')],
                loader: 'babel-loader',
                options: {
                    presets: [
                        ['@babel/preset-env', { modules: false }],
                        '@babel/preset-react'
                    ],
                    plugins: [
                        ['@babel/plugin-proposal-decorators', { 'legacy': true }],
                        '@babel/proposal-class-properties',
                        '@babel/plugin-syntax-dynamic-import',
                        '@babel/plugin-transform-object-assign',
                        ['@babel/plugin-transform-runtime', { 'corejs': 2 }]
                    ]
                }
            }
        ]
    },
    plugins: ([
        new CleanWebpackPlugin()
    ]).concat(isDev ? [
        new webpack.HotModuleReplacementPlugin()
    ] : []),
    resolve: {
        extensions: [
            '.js',
            '.jsx'
        ]
    },
    mode: isDev ? 'development' : 'production',
    devtool: 'source-map'
};

module.exports = config;