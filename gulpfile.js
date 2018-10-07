'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');

gulp.task('html', () =>
  gulp
    .src('./src/index.html')
    .pipe(gulp.dest('./build'))
);

gulp.task('sass', function(){
  return gulp.src('./src/scss/styles.scss')
    .pipe(sass()) // Converts Sass to CSS with gulp-sass
    .pipe(gulp.dest('build/css'))
});


// gulp.task('styles', () =>
//   gulp
//     .src('./src/scss/styles.scss')
//     .pipe(plumber())
//     .pipe(
//       stylelint({
//         reporters: [{ formatter: 'string', console: true }],
//       }),
//     )
//     .pipe(sass())
//     .pipe(postcss([autoprefixer()]))
//     .pipe(gcmq())
//     .pipe(gulp.dest('./build/css'))
//     .pipe(cssnano())
//     .pipe(rename('styles.min.css'))
//     .pipe(gulp.dest('./build/css'))
//     .pipe(browserSync.stream()),
// );