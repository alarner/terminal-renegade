var watchify = require('watchify');
var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash.assign');
var babelify = require('babelify');
var webserver = require('gulp-webserver');
var minimist = require('minimist');
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var sass = require('gulp-sass');

// add custom browserify options here
var customOpts = {
	entries: ['./src/scripts/main.js'],
	debug: true
};
var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts).transform(babelify));

gulp.task('js', bundle); // so you can run `gulp js` to build the file
b.on('update', bundle); // on any dep update, runs the bundler
b.on('log', gutil.log); // output build logs to terminal

gulp.task('webserver', function() {
	gulp.src('./src')
	.pipe(webserver({
		fallback:   'index.html',
		livereload: false,
		directoryListing: {
			enable: false,
			path: './src'
		},
		open: true
	}));
});

gulp.task('serve', ['js', 'serve-css', 'webserver'], function() {
	gulp.watch('src/styles/**/*.scss',['serve-css']);
});

gulp.task('serve-css', function() {
	gulp.src('src/styles/all.scss')
	.pipe(sass({
		errLogToConsole: true
	}))
	.pipe(gulp.dest('./src/styles'));
});

gulp.task('deploy', ['deploy-js', 'deploy-html', 'deploy-css', 'deploy-images']);

gulp.task('deploy-js', function() {
	var argv = require('minimist')(process.argv.slice(2));
	if(!argv.o) {
		console.error('You must specify and output directory for `gulp deploy`. Format: `gulp deploy -o outputdir`')
	}
	mkdirp(path.join(argv.o, 'scripts'));
	browserify("./src/scripts/main.js", { debug: true })
	.transform(babelify)
	.bundle()
	.on("error", function (err) { console.log("Error : " + err.message); })
	.pipe(fs.createWriteStream(path.join(argv.o, 'scripts/all.js')));
});

gulp.task('deploy-html', function() {
	var argv = require('minimist')(process.argv.slice(2));
	if(!argv.o) {
		console.error('You must specify and output directory for `gulp deploy`. Format: `gulp deploy -o outputdir`')
	}
	gulp
	.src('./src/index.html')
	.pipe(gulp.dest(argv.o));
});

gulp.task('deploy-css', function() {
	var argv = require('minimist')(process.argv.slice(2));
	if(!argv.o) {
		console.error('You must specify and output directory for `gulp deploy`. Format: `gulp deploy -o outputdir`')
	}
	mkdirp(path.join(argv.o, 'styles'));
	gulp.src('./src/styles/all.scss')
	.pipe(sass().on('error', sass.logError))
	.pipe(gulp.dest(path.join(argv.o,'styles')));
});

gulp.task('deploy-images', function() {
	var argv = require('minimist')(process.argv.slice(2));
	if(!argv.o) {
		console.error('You must specify and output directory for `gulp deploy`. Format: `gulp deploy -o outputdir`')
	}
	mkdirp(path.join(argv.o, 'images'));
	gulp
	.src('./src/images/**/*')
	.pipe(gulp.dest(path.join(argv.o, 'images')));
});

function bundle() {
	return b.bundle()
	// log errors if they happen
	.on('error', gutil.log.bind(gutil, 'Browserify Error'))
	.pipe(source('all.js'))
	// optional, remove if you don't need to buffer file contents
	.pipe(buffer())
	// optional, remove if you dont want sourcemaps
	.pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
	// Add transformation tasks to the pipeline here.
	.pipe(sourcemaps.write('./')) // writes .map file
	.pipe(gulp.dest('./src/scripts'));
}