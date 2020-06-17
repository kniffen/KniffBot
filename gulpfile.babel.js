import dotenv  from "dotenv-flow"
import gulp    from "gulp"
import plumber from "gulp-plumber"
import babel   from "gulp-babel"
import mocha   from "gulp-mocha"

dotenv.config()

function build() {
  return gulp.src("source/**/*.js")
    .pipe(plumber())
    .pipe(babel())
    .pipe(gulp.dest("dist"))
}

function test() {
  return gulp.src("dist/tests/**/*.test.js", {read: false})
    .pipe(plumber())
    .pipe(mocha({
      reporter: 'spec',
      timeout:   5000,
      exit: true
    }))
}

function devTest() {
  return gulp.src("source/tests/**/*.test.js", {read: false})
    .pipe(plumber())
    .pipe(mocha({
      reporter: 'min',
      timeout:   5000,
      require:   [
        "@babel/register",
        "source-map-support/register"
      ],
      exit: true
    }))
}

function dev() {
  gulp.watch("source/**/*.js", {cwd: "./"}, devTest)
}

exports.build = build
exports.test  = gulp.series(build, test)
exports.dev   = gulp.series(devTest, dev)