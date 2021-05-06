const gulp = require('gulp')
const plumber = require('gulp-plumber')
const ts = require('gulp-typescript')
const mocha = require('gulp-mocha')

require('dotenv-flow').config()

const tsBuild = ts.createProject('tsconfig.json')

function build() {
  return gulp
    .src('./src/**/*.ts')
    .pipe(plumber())
    .pipe(tsBuild())
    .pipe(gulp.dest('dist'))
}

function test() {
  return gulp
    .src(['./tests/**/*.test.ts'], {read: false, sourcemaps: true})
    .pipe(plumber())
    .pipe(mocha({
      reporter: 'spec',
      timeout:   5000,
      recursive: true,
      extension: ['js', 'ts'],
      require: ['ts-node/register'],
      exit: true
    }))
}

function watch() {
  gulp.watch(["src/**/*.ts", "tests/**/*.ts"], {cwd: "./"}, test)
  gulp.watch("src/**/*.ts", {cwd: "./"}, build)
}

module.exports.default = gulp.series(test, build, watch)
module.exports.build = build
module.exports.test = test