
/* Notes:
   - gulp/tasks/browserify.js handles js recompiling with watchify
   - gulp/tasks/browserSync.js watches and reloads compiled files
*/

var gulp   = require('gulp'),
	config = require('../config').importCSS,
	importCss = require('gulp-import-css');

gulp.task('importCSS', function () {
  gulp.src(config.src)
//    .pipe(importCss())
    .pipe(gulp.dest(config.dest));
});
