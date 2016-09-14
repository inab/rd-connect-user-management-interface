/* Notes:
   - gulp/tasks/browserify.js handles js recompiling with watchify
   - gulp/tasks/browserSync.js watches and reloads compiled files
*/

var gulp   = require('gulp'),
	config = require('../config').fonts;

gulp.task('fonts', function () {
  gulp.src(config.src)
    .pipe(gulp.dest(config.dest));
});
