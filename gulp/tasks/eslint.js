var gulp = require('gulp');
var eslint = require('gulp-eslint');
var config = require('../config');

// Lint JS/JSX files
gulp.task('eslint', ['buildInfo'], function() {
  return gulp.src(config.eslint.src)
    .pipe(eslint({
      baseConfig: {
        "ecmaFeatures": {
           "jsx": true
         }
      }
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

