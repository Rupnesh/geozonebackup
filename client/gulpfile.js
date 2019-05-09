const gulp = require('gulp');
const concat = require('gulp-concat');
const sass = require('gulp-sass');

gulp.task('sass', () => gulp.src('./scss/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('style.css'))
    .pipe(gulp.dest('./public/css'))
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(concat('style.min.css'))
    .pipe(gulp.dest('./public/css'))
);

// Watching SCSS files
gulp.task('sass:watch', () => {
  gulp.watch('./scss/**/*.scss', ['sass']);
});

gulp.task('default', ['sass:watch']);
