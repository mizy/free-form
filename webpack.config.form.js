const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
 
let webpackConfig = {
    entry: './src/index.js',
    output: {
		library: "free-form",
		libraryTarget: "umd",
		libraryExport: "default", // 默认导出
		filename: "index.js"
	},
	externals: [
        function({context,request},callback){
            if(/(antd|react)/.test(request)){
                console.log(request)
                return callback(null,request)
            }
            callback();
        }
    ],
	optimization: {
        minimize: false
    },
    mode:'production',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                    {
                        loader: 'babel-loader',
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
            '@': path.resolve(__dirname, 'src'),
            'app': path.resolve(__dirname, 'app')
        }
    },
}; 
module.exports = webpackConfig;
