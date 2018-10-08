'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const sequence = require('run-sequence');
const babel = require('gulp-babel');
const postcss = require('gulp-postcss');
//const autoprefixer = require('autoprefixer');
const autoprefixer = require('gulp-autoprefixer');


gulp.task('html', () =>
  gulp
    .src('./src/index.html')
    .pipe(gulp.dest('./build'))
);

gulp.task('sass', function(){
  return gulp.src('./src/scss/styles.scss')
    .pipe(sass()) // Converts Sass to CSS with gulp-sass
    .pipe(autoprefixer({add: true, browsers: ['last 5 versions']}))
    //.pipe(postcss([autoprefixer()]))
    .pipe(gulp.dest('build/css'))
    .pipe(browserSync.stream());
});

gulp.task('scripts', () => {
  gulp
    .src('./src/js/**/*.js')
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(gulp.dest('./build/js'));
    //console.log('scripts');
}
);


gulp.task('serve', function() { // ['sass'], зачем этот аргумент????

  browserSync.init({
      server: "./build"
  });

});

gulp.task('watch', function(){
  gulp.watch("src/scss/**/*.scss", ['sass']);
  gulp.watch('src/js/**/*.js', ['scripts']).on('change', browserSync.reload);
  gulp.watch("src/*.html", ['html']).on('change', browserSync.reload);
})


gulp.task('start', cb => sequence(['html', 'sass', 'scripts'],'serve', 'watch'));