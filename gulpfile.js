require("dotenv-flow").config()

const gulp       = require("gulp")
const plumber    = require("gulp-plumber")
const sourcemaps = require("gulp-sourcemaps")
const babel      = require("gulp-babel")
const mocha      = require("gulp-mocha")

function build() {
  return gulp.src("source/**/*.js")
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ["@babel/env"],
      plugins: [
        [
          "@babel/plugin-transform-runtime",
          {
            "regenerator": true
          }
        ]
      ]
    }))
    .pipe(sourcemaps.write('.', {
      sourceRoot: function (file) {
        return file.cwd + '/source';
      }
    }))
    .pipe(gulp.dest("dist"))
}

function test() {
  return gulp.src("dist/tests/**/*.test.js", {read: false})
    .pipe(plumber())
    .pipe(mocha({
      reporter: 'spec',
      timeout:   5000,
      require:   ['source-map-support/register'],
      exit: true
    }))
}

function dev() {
  gulp.watch("source/**/*.js", {cwd: "./"}, gulp.series(build, test))
}

module.exports.build = build
module.exports.test  = gulp.series(build, test)
module.exports.dev   = gulp.series(build, test, dev)