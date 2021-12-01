const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

let webpackConfig = {
    entry: './demo/index.js',
    output: {
        publicPath: '/',
        filename: '[name].js'
    },
    devtool: 'eval-source-map',
    devServer: {
        port: 8008,
        index: 'index.html',
        open: true,
        host: '0.0.0.0',
        contentBase: [path.join(__dirname, './public')],
        openPage: './',
        hot: true,
        historyApiFallback: true,
    },
    optimization: {
        // splitChunks: {
        //     chunks: 'all',
        //     minSize: 200000,
        //     maxSize: 2000000
        // }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ['@babel/preset-env'],
                                '@babel/preset-react'
                            ]
                        }
                    }
                ]
            },
            {
                test: /(\.less|\.css)$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' },
                    {
                        loader: 'less-loader',
                    }
                ]
            }
        ]
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    mode: 'development',
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './demo/index.html',
            publicPath: '/'
        }),
        new webpack.ProvidePlugin({
            React: 'react'
        }),
        new webpack.DllReferencePlugin({
            context: path.resolve(__dirname, './public/dll'),
            manifest: require('./public/dll/manifest_dll.json')
        }),
        // new BundleAnalyzerPlugin({
        //     generateStatsFile: true
        // })
    ]
};
module.exports = webpackConfig;
