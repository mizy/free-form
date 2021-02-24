const path = require('path');
const webpack = require('webpack');
const vendor = [
    'antd',
    'moment'
];
 
const dllPath = path.join(__dirname, 'public/dll');

module.exports = {
	entry: {
		dll: vendor
	},
	output: {
		path: dllPath,
		filename: '[name].js',
		library: '[name]'
    },
    externals:{
        React:"react"
    },
	plugins: [
		new webpack.DllPlugin({
			name: '[name]',
			context: dllPath,
			path: path.join(__dirname, 'public/dll', 'manifest_[name].json')
		})
	]
};
