var webpack = require('webpack');
var htmlWebpackPlugin = require('html-webpack-plugin');
var helpers = require('./helpers');
var path = require('path');
var CopyWebpackPlugin = require("copy-webpack-plugin");
var isTest=false;
module.exports = {
	entry: {
		polyfills: './src/polyfills.ts',
		app: './src/main.ts',
	},
	module: {
		rules: [
			// {
			// 	test: /\.ts$/,
			// 	loader: 'awesome-typescript-loader',
			// 	exclude:["node_modules"],
			// },
			{
				test: /\.ts$/,
				loaders: ['awesome-typescript-loader?', 'angular2-template-loader', '@angularclass/hmr-loader'],
				exclude: [isTest ? /\.(e2e)\.ts$/ : /\.(spec|e2e)\.ts$/, /node_modules\/(?!(ng2-.+))/]
			},

			{
				test: /\.scss$/,
				loader: 'style-loader!css-loader!sass-loader'
				},
				{
					test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
					loader: 'file-loader',
				},
				{
					test: /\.node$/,
					loader: 'node-loader',
				}
			],
		},
		resolve: {
		modules: [path.resolve(__dirname, 'src'), 'node_modules'],
		extensions: ['.ts', '.js', '.json', '.scss', '.css', 'html'],
	},
	output: {
		path: path.join(__dirname, 'dist/'),
		publicPath: path.join(__dirname, 'dist/assets/'),
		filename: '[name].bundle.js',
	},
	target:"electron-renderer",
	plugins: [
		new webpack.ContextReplacementPlugin(
			/angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
			__dirname
		),
		new webpack.optimize.CommonsChunkPlugin({
			name: ['app', 'polyfills']
		}),
		new CopyWebpackPlugin([
			{
				from:"index.html",
				to:"index.html"
			}
		],{
			force:true,
		})
	]
};