let gulp = require('gulp');
let uglify = require('gulp-uglify');
let concat = require('gulp-concat');
let rename = require('gulp-rename');
let cleanCSS = require('gulp-clean-css');

// Concatenate & Minify JS
gulp.task('scripts', function () {
    return gulp.src('styles/**/*.js')
        .pipe(uglify())
        //.pipe(concat('all.js'))
        .pipe(gulp.dest('dist/styles/'));
});

gulp.task('copy-fonts', function () {
    return gulp.src(['styles/fonts/**/*'])
        .pipe(gulp.dest('dist/styles/fonts/'))
})

gulp.task('copy-images', function () {
    return gulp.src(['styles/images/**/*'])
        .pipe(gulp.dest('dist/styles/images'))
})

gulp.task('css', function () {
    return gulp.src('styles/**/*.css')
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        //.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
        //.pipe(concat('all.min.css'))
        .pipe(gulp.dest('dist/styles/'))
});

gulp.task('copy-vendor', function () {
    return gulp.src(['styles/vendor/**/*'])
        .pipe(gulp.dest('dist/styles/vendor'))
})

// Default Task
gulp.task('default', gulp.parallel('copy-fonts', 'copy-images', 'scripts', 'css', 'copy-vendor'));
