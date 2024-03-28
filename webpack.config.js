const path = require("path"),
	webpack = require("webpack"),
	MiniCssExtractPlugin = require("mini-css-extract-plugin"),
	LicensePlugin = require("webpack-license-plugin"),
	HtmlWebpackPlugin = require("html-webpack-plugin"),
	threadLoader = require("thread-loader"),
	WorkboxPlugin = require("workbox-webpack-plugin"),
	RemoveEmptyScriptsPlugin = require("webpack-remove-empty-scripts"),
	CopyPlugin = require("copy-webpack-plugin"),
	{ CleanWebpackPlugin } = require("clean-webpack-plugin"),
	BundleAnalyzerPlugin =
		require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const app_settings = require("./src/js/sgs/apps/wp_config");
const toml = require("toml"),
	yaml = require("yamljs"),
	json5 = require("json5");

let Mime = null;
import("mime").then((file) => (Mime = file.default));

const config = {
	entry: {
		main: [
			path.resolve("src", "js", "app.js"),
			path.resolve("src", "scss", "style.scss"),
		],
	},
	output: {
		filename: (pathData) => {
			let groupName = [...pathData.chunk.idNameHints][0],
				filename = pathData.chunk.id
					.replaceAll("node_modules_", "")
					.split("-")
					.slice(1, -1)
					.join("_");
			if (typeof groupName === "undefined") {
				return `js/${filename}.js`;
			}
			return app_settings.isProduction ?
				`js/sgs.bundle.[fullhash].[id].js` :
				`js/${groupName}/${filename}.js`;
		},
		chunkFilename: (pathData) => {
			return app_settings.isProduction ?
				`js/sgs.assets.[fullhash].[id].js` :
				`js/sgs.assets.js`;
		},
		assetModuleFilename: (pathData) => {
			let filepath = pathData.filename,
				mimeClass = 'other',
				fileExt = path.extname(pathData.filename).toLowerCase();
			const removeParts = ['node_modules', 'src'],
				mapFilesToFolders = {
					img: ['.png', '.svg', '.jpeg', '.jpg', '.gif'],
					fonts: ['.woff2', '.woff', '.ttf']

				};
			Object.keys(mapFilesToFolders).forEach(key => {
				const mimeList = mapFilesToFolders[key];
				if (mimeList.find(ext => fileExt.includes(ext))) {
					mimeClass = key;
				}
			});

			let partsPathData = pathData.filename.split('/');
			if (removeParts.includes(partsPathData[0])) {
				filepath = partsPathData.slice(1).join('/');
			}

			return app_settings.isProduction ?
				`${mimeClass}/${filepath}` :
				`${mimeClass}/${filepath}`;
		},
		path: path.join(__dirname, "dist"),
		publicPath: app_settings.publicPath,
		// publicPath: "auto",
		clean: true,
		globalObject: "this",
		library: {
			name: "sgs",
			type: "umd",
		},
	},
	resolve: {
		extensions: [".js", ".ts", ".tsx", ".css", ".jpg"],
		mainFields: ["module", "browser", "main"],
		alias: {
			app: path.resolve(__dirname, "src/sgs/"),
			assets: path.resolve(__dirname, "assets/"),
		},
	},
	externals: { ...app_settings.externals },
	devServer: {
		open: true,
		host: "localhost",
	},
	cache: {
		type: "filesystem",
		cacheDirectory: path.resolve(__dirname, ".temp_cache"),
		compression: "gzip",
		allowCollectingMemory: true,
	},
	plugins: [
		// new webpack.ContextReplacementPlugin(),
		new webpack.BannerPlugin({
			banner: app_settings.banner,
			raw: false,
			entryOnly: false,
			include: /\.(js|jsx|css)$/,
		}),
		new MiniCssExtractPlugin({
			filename: (pathData, assetInfo) => {
				let groupName = [...pathData.chunk.idNameHints][0],
					filename = pathData.chunk.id;
				if (filename.indexOf("-") >= 0) {
					filename = filename
						.split("-")
						.slice(1, -1)
						.join("-")
						.replaceAll("node_modules_", "");
				}
				return `css/${groupName}/${filename}.css`;
			},
			chunkFilename: (pathData, assetInfo) => {
				return `css/${pathData.chunk.name}.chunk.css`;
			},
		}),
		new RemoveEmptyScriptsPlugin(),
		new LicensePlugin({
			licenseOverrides: {
				"fancybox@3.0.1": "CC-BY-NC-3.0",
				"@fancyapps/ui@5.0.32": "CC-BY-SA-4.0",
			},
			includePackages: () => {
				return [];
			},
		}),
		new webpack.AutomaticPrefetchPlugin(),
		new webpack.DefinePlugin({}),
		new CleanWebpackPlugin({
			protectWebpackAssets: false,
			cleanAfterEveryBuildPatterns: ["*.LICENSE.txt"],
		}),
		new HtmlWebpackPlugin({
			alwaysWriteToDisk: true,
			inject: false,
			// If you have multiple entry points and only some should be loaded
			// this way, list those entry points in the chunks config
			// chunks: ['sdk'],
			filename: "js/load.chunks.js",
			minify: false,
			templateContent: ({ htmlWebpackPlugin }) => {
				return `"use strict";
        (function(m) {
          var _debug = new URLSearchParams(window.location.search).get('_'),
            no_cache = (_debug != null && _debug.toLowerCase() === 'true') ? new Date().getTime() : "",
            baseUrl = new URL(m.publicPath, document.currentScript.src),
            lastJS = "",
            lastStyle = "";
          m.js.forEach((src, ndx) => {
            let sgs_app_after_elm = document.body.querySelector("script[src*='load.chunks.js']"),
            sc=document.createElement('script');
            // check for the first loop
            if (ndx !== 0) {
                sgs_app_after_elm = document.body.querySelector("script[src*='"+lastJS+"']");
            }
            sc.src = src;
            if (no_cache) {
                sc.src = src+"?v="+no_cache;
            }
            sc.async = true;
            sc.onload = () => {
              console.info("%cAsset loaded: " + sc.src, 'background: #222; color: #bada55');
            };
            sc.onerror = () => {
              console.error("%cAsset fail to load: " + sc.src, 'background: #222; color: #bada55');
            };
            document.body.insertBefore(sc, sgs_app_after_elm.nextSibling);
            lastJS = src;
          });
          m.css.forEach((href, ndx) => {
              let parent_style = document.head.querySelectorAll('link[rel="stylesheet"')[2],
                st = document.createElement('link');
              // check for the first loop
              if (ndx !== 0) {
                  parent_style = document.head.querySelector("link[href*='"+lastStyle+"']");
              }
              st.type = 'text/css';
              st.rel = 'stylesheet';
              st.href = href;
              if (no_cache) {
                  st.href = href +"?v="+no_cache;
              }
              if (parent_style === undefined) {
                let head = document.getElementsByTagName("head")[0];
                document.head.insertBefore(st, head.firstChild);
              } else {
                document.head.insertBefore(st, parent_style.nextSibling);
              }
              lastStyle = href;
          });
        })(${JSON.stringify(htmlWebpackPlugin.files, null, 2)});`;
			},
		}),
		new CopyPlugin({
			patterns: [
				{
					from: path.resolve(__dirname, "assets", "img", "brands"),
					to: "img/brands",
				},
				{
					from: path.resolve(__dirname, "assets", "img", "pwa"),
					to: "img/pwa",
				},
				{
					from: path.resolve(__dirname, "assets", "pwa"),
					to: ".",
				},
			],
		}),
		// new WorkboxPlugin.GenerateSW({ clientsClaim: true, skipWaiting: true }),
	],
	module: {
		rules: [
			{
				test: /\.(?:js|mjs|cjs|jsx)$/,
				type: "javascript/auto",
				exclude: /node_modules/,
				use: [
					{ loader: "thread-loader", options: app_settings.babelWorkerOptions },
					{
						loader: "babel-loader",
						options: {
							cacheDirectory: path.resolve(__dirname, ".temp_cache"),
							presets: [["@babel/preset-env", { targets: "defaults" }]],
						},
					},
				],
			},
			{
				test: /\.((?:s[ac]|c)ss)$/,
				exclude: /node_modules/,
				type: "asset/resource",
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							esModule: false,
						},
					},
					{
						loader: "css-loader",
						options: {
							sourceMap: true,
							esModule: false,
						},
					},
					{
						loader: "sass-loader",
						options: {
							sourceMap: true,
							implementation: require("sass"),
							sassOptions: {
								indentedSyntax: false,
							},
						},
					},
				],
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)(\?v=\d+\.\d+\.\d+)?$/,
				type: "asset/resource",
			},
			{
				test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
				type: "asset/resource",
			},
			{
				test: /\.(ico|png|jpg|jpeg|gif|webp)$/,
				type: "asset/resource",
			},
			{
				test: /\.(csv|tsv)$/,
				use: ["csv-loader"],
			},
			{
				test: /\.xml$/,
				use: ["xml-loader"],
			},
			{
				test: /\.toml$/,
				type: "json",
				parser: {
					parse: toml.parse,
				},
			},
			{
				test: /\.yaml$/,
				type: "asset/source",
				parser: {
					parse: yaml.parse,
				},
			},
			{
				test: /\.json$/,
				type: "javascript/auto",
				loader: "json-loader",
			},
			{
				test: /\.json5$/,
				type: "json",
				parser: {
					parse: json5.parse,
				},
			},
			{
				test: /\.html$/,
				loader: "html-loader",
				options: {},
			},
		],
	},
	optimization: {
		sideEffects: true,
		usedExports: true,
		removeEmptyChunks: true,
		splitChunks: {
			minChunks: 1,
			maxSize: 1024000,
			cacheGroups: {
				vendors: {
					test: /[\\/]node_modules[\\/]/,
					filename: (pathData) => {
						let groupName = [...pathData.chunk.idNameHints][0],
							filename = pathData.chunk.id
								.split("-")[1]
								.split("_")
								.slice(2)
								.join("_");
						return `js/${groupName}/${filename}.js`;
					},
					minChunks: 1,
					priority: -10,
					reuseExistingChunk: true,
					chunks: "all",
				},
				default: {
					filename: (pathData) => {
						return `js/[name].js`;
					},
					minChunks: 1,
					priority: -20,
					reuseExistingChunk: true,
					chunks: "all",
				},
			},
		},
		minimize: app_settings.isProduction,
		minimizer: [
			(compiler) => {
				const TerserPlugin = require("terser-webpack-plugin");
				new TerserPlugin({
					minify: TerserPlugin.uglifyJsMinify,
					terserOptions: {},
					parallel: true,
					extractComments: "all",
					exclude: /\.min\.js$/,
					test: /\.js(\?.*)?$/i,
				}).apply(compiler);
			},
			(compiler) => {
				const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
				new CssMinimizerPlugin({
					parallel: 4,
				}).apply(compiler);
			},
		],
	},
	stats: {
		colors: true,
		errorDetails: true
	},
};

module.exports = async () => {
	if (app_settings.isProduction) {
		config.mode = "production";
		config.devtool = "source-map";
		// config.plugins.push(new WorkboxWebpackPlugin.GenerateSW());
	} else {
		config.mode = "development";
		// config.devtool = "eval";
		config.devtool = "cheap-module-source-map";

		config.plugins.push(
			new BundleAnalyzerPlugin({
				openAnalyzer: false,
			}),
		);
		threadLoader.warmup(app_settings.babelWorkerOptions, [
			"babel-loader",
			"@babel/preset-env",
			"sass-loader",
		]);
		threadLoader.warmup(app_settings.tsWorkerOptions, [
			"babel-loader",
			"@babel/preset-env",
			"sass-loader",
		]);
	}
	return config;
};
