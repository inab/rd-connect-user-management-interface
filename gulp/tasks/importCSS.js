
/* Notes:
   - gulp/tasks/browserify.js handles js recompiling with watchify
   - gulp/tasks/browserSync.js watches and reloads compiled files
*/

var gulp   = require('gulp');
var config = require('../config');
var importCss = require('gulp-import-css');

gulp.task('importCSS', function () {
  gulp.src('assets/*.css')
    .pipe(importCss())
    .pipe(gulp.dest('build/'));
});