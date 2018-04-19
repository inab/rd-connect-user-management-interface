var gulp = require('gulp');

gulp.task('build', ['importCSS','fonts','eslint', 'browserify', 'markup', 'less']);
