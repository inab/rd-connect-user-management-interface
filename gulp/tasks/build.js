var gulp = require('gulp');

gulp.task('build', ['importCSS','browserify', 'markup', 'less']);
