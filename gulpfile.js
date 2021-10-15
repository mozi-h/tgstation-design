var { series, src, dest, watch } = require("gulp");
var sass = require("gulp-sass")(require("sass"));
var sourcemaps = require("gulp-sourcemaps");
var del = require("del");

function clean() {
	return del("./dist");
}

function copyAll() {
	return src(["./src/**", "!./src/scss/**"]).pipe(dest("./dist"));
}

function buildStyles() {
	return src("./src/scss/**/*.scss")
		.pipe(sourcemaps.init())
		.pipe(
			sass({
				includePaths: ["./node_modules/"],
			}).on("error", sass.logError)
		)
		.pipe(sourcemaps.write())
		.pipe(dest("./dist/css"));
}

module.exports = {
	clean,
	copyAll,
	buildStyles,
	watch: function () {
		clean();
		watch(["./src/**", "!./src/scss/**"], { ignoreInitial: false }, copyAll);
		watch("./src/scss/**/*.scss", { ignoreInitial: false }, buildStyles);
	},
	default: series(clean, copyAll, buildStyles),
};
