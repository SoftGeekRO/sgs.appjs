const path = require("path");
const pkg = require("../../../../package.json");

// constants
const publicPath = "https://cdn.sgsolar.ro/sgs.app/",
	// dotenv = require("dotenv").config({ path: __dirname + "/.env" }),
	base_path = path.resolve(__dirname, "../../../../"),
	sourcePath = path.join(base_path, "src"),
	outPath = path.join(base_path, "dist");

const banner = `SGS Library pack;

SG SOLAR Library pack for improvement the online store with features and tweaks

@author     Zaharia Constantin <constantin.zaharia@sgsolar.ro>
@version    ${pkg.version}
@link       https://github.com/soulraventnt/???
@license    GPLv3

Copyright (c) ${new Date().getFullYear()} Zaharia Constantin <constantin.zaharia@sgsolar.ro>

This software is released under the GPLv3 License.
https://opensource.org/license/gpl-3-0`;

const isProduction = process.env.NODE_ENV === "production";

const jsWorkerCommonOptions = {
		workers: 2,
		workerParallelJobs: 50,
		poolParallelJobs: 50,
	},
	babelWorkerOptions = {
		...jsWorkerCommonOptions,
		name: "babel-pool",
	},
	tsWorkerOptions = {
		...jsWorkerCommonOptions,
		name: "ts-pool",
	};

const externals = {
	jquery: {
		commonjs: "$",
		commonjs2: "$",
		root: "$",
	},
	// lodash: {
	// 	commonjs: "lodash",
	// 	commonjs2: "lodash",
	// 	root: "_",
	// },
	// "handlebars/runtime": {
	// 	root: "Handlebars",
	// 	amd: "handlebars/runtime",
	// 	commonjs2: "handlebars/runtime",
	// 	commonjs: "handlebars/runtime",
	// },
	// handlebars: {
	// 	root: "Handlebars",
	// 	amd: "Handlebars",
	// 	commonjs: "handlebars",
	// 	commonjs2: "handlebars",
	// },
	// fancybox: {
	// 	root: "Fancybox",
	// 	amd: "Fancybox",
	// 	commonjs: "Fancybox",
	// 	commonjs2: "Fancybox",
	// },
	// bxslider: {
	// 	root: "bxSlider",
	// 	amd: "bxSlider",
	// 	commonjs: "bxSlider",
	// 	commonjs2: "bxSlider",
	// },
};

module.exports = {
	isProduction,
	publicPath,
	base_path,
	sourcePath,
	outPath,
	banner,
	externals,
	babelWorkerOptions,
	tsWorkerOptions,
};
