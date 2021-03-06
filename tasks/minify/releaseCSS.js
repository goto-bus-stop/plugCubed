'use strict';

const gulp = require('gulp');
const cssnano = require('gulp-cssnano');
const bytediff = require('gulp-bytediff');
const sourcemaps = require('gulp-sourcemaps');

gulp.task('minify:releaseCSS', () => {
    return gulp
        .src('src/release/plugCubed.css')
        .pipe(sourcemaps.init())
        .pipe(bytediff.start())
        .pipe(cssnano({
            autoprefixer: false,
            zindex: false,
            normalizeCharset: false
        }))
        .pipe(bytediff.stop())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('bin/release/'));
});
