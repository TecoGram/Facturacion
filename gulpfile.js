const gulp = require('gulp');
const prettierPlugin = require('gulp-prettier-plugin');
const isCI = process.env.CI;

gulp.task('prettier', () =>
  gulp
    .src([
      './src/**/*.js',
      './backend/**/*.js',
      './test/**/*.js',
      './gulpfile.js',
    ])
    .pipe(
      prettierPlugin(
        {
          trailingComma: 'es5',
          singleQuote: true,
        },
        {
          filter: true,
          validate: isCI,
        }
      )
    )
    // passing a function that returns base will write the files in-place
    .pipe(gulp.dest(file => file.base))
);
