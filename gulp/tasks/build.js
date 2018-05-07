var gulp = require('gulp');

gulp.task('build', ['importCSS','fonts', 'buildInfo', 'eslint', 'browserify', 'markup', 'less']);
