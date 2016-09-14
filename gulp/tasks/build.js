var gulp = require('gulp');

gulp.task('build', ['importCSS','fonts','browserify', 'markup', 'less']);
