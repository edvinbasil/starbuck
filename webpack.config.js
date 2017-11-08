const webpack = require('webpack');
const path = require('path');

const MinifyPlugin = require('babel-minify-webpack-plugin');

const config = {
	entry: {
		app: ['psychic.css/dist/psychic.min.css', 'whatwg-fetch', './src/app.js'],
		vendor: ['react', 'react-dom', 'react-router-dom', 'prop-types'],
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js'
	},
	devServer: {
		proxy: {
			'/api/**': 'http://localhost:8000',
			'/badge/**': 'http://localhost:8000'
		},
		contentBase: 'dist',
		inline: true,
		hot: true,
		historyApiFallback: true
	},
	context: __dirname,
	module: {
		rules: [{
			test: /\.css$/,
			use: [{
				loader: 'style-loader'
			},
			{
				loader: 'css-loader',
				options: {
					sourceMap: true
				}
			}
			]
		},
		{
			test: /.jsx?$/,
			loader: 'babel-loader',
			exclude: /node_modules/,
			query: {
				presets: ['env', 'react']
			}
		}
		]
	},
	resolve: {
		modules: [path.resolve(__dirname, 'node_modules'), 'node_modules']
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': process.env.NODE_ENV ? `"${process.env.NODE_ENV}"` : JSON.stringify('production')
			}
		}),
		new webpack.optimize.AggressiveMergingPlugin(),
		new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.bundle.js' })
	]
};

if(process.env.NODE_ENV === 'production') {
	config.plugins.push(new MinifyPlugin());
}

module.exports = config;
