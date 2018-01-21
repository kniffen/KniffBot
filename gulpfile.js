const gulp = require('gulp')
const plumber = require('gulp-plumber')
const babel = require('gulp-babel')
const mocha = require('gulp-mocha')

gulp.task('watch', () => {
  gulp.watch('source/**/*.js', {cwd: './'}, ['build'])
})

gulp.task('build', () => {
  gulp.src('source/**/*.js')
    .pipe(plumber())
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('build'))
})

gulp.task('test', () => {
  gulp.src('./build/spec/**/*.spec.js')
    .pipe(plumber())
    .pipe(mocha())
})

gulp.task('default', ['watch', 'build'])