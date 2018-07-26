const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');

const GitInfoReplace = require('./info-replace.js');

const SRC = path.resolve(__dirname,'src');
var DIST = path.resolve(__dirname,'build');

const PATHS = {
	json: path.resolve(SRC,'json'),
	app: path.resolve(SRC,'app'),
	www: path.resolve(SRC,'www'),
	less: path.resolve(SRC,'less'),
	dist: DIST
};

const DIST_PATHS = {
	css: 'css',
	images: 'images',
	fonts: 'fonts',
};

GitInfoReplace({filename: path.join(SRC,'buildinfo.json')});

module.exports = (env, argv) => {
	var optimization;
	var devtool;
	var sourceMap;
	if(argv.mode === 'production') {
		devtool = 'source-map';
		sourceMap =  true;
	} else {
		devtool = false;
		sourceMap = false;
	}
	//if(argv.mode === 'production') {
		// Setting the optimization parameters
		optimization = {
			runtimeChunk: true,
			splitChunks: {
		//		chunks: 'all',
				cacheGroups: {
					vendor: {
						test: /[\\/]node_modules[\\/]/,
						name: 'vendors',
						chunks: 'all'
					},
					buildinfo: {
						test: /[\\/]buildinfo.json/,
						minSize: 0,
						priority: 10,
						name: 'info',
						chunks: 'all'
					}
				}
			}
		};

	//} else {
	//	optimization = {};
	////	DIST = path.resolve(__dirname,'build-dev');
	////	PATHS.dist = DIST;
	//}
	
	return {
		mode: 'development',
		devtool: devtool,
		entry: {
			umi: path.join(PATHS.app, 'UMI.jsx')
		},
		optimization: optimization,
		output: {
			filename: 'js/[name].[chunkhash].js',
			chunkFilename: 'js/[name].[id].[chunkhash].js',
			path: PATHS.dist
		},
		resolve: {
			modules: [
				PATHS.app,
				PATHS.less,
				path.resolve(__dirname, "node_modules")
			]
		},
		module: {
			rules: [
				{
					enforce: "pre",
					test: /\.jsx?$/,
					include: PATHS.app,
					use: {
						loader: "eslint-loader",
						options: {
							cache: true
						}
					}
				},
				{
					test: /\.jsx?$/,
					exclude: /node_modules/,
					use: {
						loader: "babel-loader",
						options: {
							cacheDirectory: true,
							presets: [
								"@babel/preset-env",
								"@babel/preset-react"
							],
							plugins: [
								'@babel/plugin-transform-runtime'
							],
							sourceMap: sourceMap
						}
					}
				},
				{
					test: /\.less$/,
					use: [
						{ 
							loader: "style-loader",
						},
						{
							loader: "css-loader",
							options: {
								sourceMap: sourceMap
							}
						},
						{
							loader: "less-loader",
							options: {
								paths: [
									PATHS.less,
									path.resolve(__dirname, "node_modules")
								],
								sourceMap: sourceMap
							}
						}
					]
				},
				{
					test: /\.png$/,
					use: [
						{
							loader: "url-loader",
							options: {
								outputPath: DIST_PATHS.images,
								limit: 1000
							}
						}
					]
				},
				{
					test: /\.jpg$/,
					use: [
						{
							loader: "file-loader",
							options: {
								outputPath: DIST_PATHS.images,
							}
						}
					]
				},
				{
					test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
					use: [
						{
							loader: "url-loader",
							options: {
								outputPath: DIST_PATHS.fonts,
								limit: 1000,
								mimetype: "application/font-woff"
							}
						}
					]
				},
				{
					test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
					use: [
						{
							loader: "url-loader",
							options: {
								outputPath: DIST_PATHS.fonts,
								limit: 1000,
								mimetype: "application/octet-stream"
							}
						}
					]
				},
				{
					test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
					use: [
						{
							loader: "file-loader",
							options: {
								outputPath: DIST_PATHS.fonts,
							}
						}
					]
				},
				{
					test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
					use: [
						{
							loader: "url-loader",
							options: {
								outputPath: DIST_PATHS.images,
								limit: 1000,
								mimetype: "image/svg+xml"
							}
						}
					]
				}
			]
		},
		plugins: [
			new webpack.HashedModuleIdsPlugin(),
			//new webpack.ProvidePlugin({
			//// Parts here are needed to have bootstrap working properly
			//	$: 'jquery',
			//	jQuery: 'jquery',
			//	'window.$': 'jquery',
			//	'window.jQuery': 'jquery',
			//}),
			new CopyWebpackPlugin([
					{
						context: PATHS.json,
						from: '*.json',
						to: path.join(PATHS.dist,'json'),
					},
					{
						context: PATHS.www,
						from: 'images/*.svg',
						to: DIST
					},
					{
						context: PATHS.www,
						from: 'images/*.png',
						to: DIST
					},
					{
						context: PATHS.www,
						from: 'images/*.jpg',
					},
					{
						context: PATHS.www,
						from: 'images/*.ico',
						to: DIST
					},
					//{
					//	context: PATHS.app,
					//	from: '*.html',
					//}
			]),
			new HtmlWebpackPlugin({
				template: path.join(PATHS.www,"index.html"),
				filename: path.join(PATHS.dist,"index.html")
			}),
			new WebpackCleanupPlugin()
		]
	};

};
