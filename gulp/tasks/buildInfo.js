var gulp = require('gulp');
var config = require('../config');
var infoReplace = require('../util/info-replace');

// Lint JS/JSX files
gulp.task('buildInfo', function() {
  return infoReplace({filename: config.buildInfo.src})
    .pipe(gulp.dest(config.buildInfo.dest));
});

