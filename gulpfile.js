var gulp = require('gulp'),
    sass = require('gulp-sass'),
    minifyCSS = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    watch = require('gulp-watch'),
    replace = require('gulp-replace');

gulp.task('scripts', function(){
    return gulp.src(['src/**/*.js'])
        .pipe(concat ('main.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(uglify())
        .pipe(rename ({suffix: '.min'}))
        .pipe(gulp.dest('dist/js'))
});

gulp.task('scss', function(){
    return gulp.src(['src/css/styles.scss'])
        .pipe(sass())
        .pipe(concat('styles.css'))
        .pipe(minifyCSS())
        .pipe(rename({suffix : '.min'}))
        .pipe(gulp.dest('dist/css'))
});

gulp.task('watch', function(){
    gulp.watch('src/**/*.js', ['scripts']);
    gulp.watch('src/css/styles.scss', ['scss']);
});


gulp.task('default',['scripts', 'scss','watch']);