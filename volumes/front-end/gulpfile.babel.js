"use strict";
import { fileURLToPath } from 'url';
import gulp from "gulp";
import path from 'path';
import browserify from "browserify";
import babelify from "babelify";
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import rename from 'gulp-rename';
import clean from 'gulp-clean';
import uglify from 'gulp-uglify';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import noop from 'gulp-noop';

const __filename = fileURLToPath(import.meta.url);
const srcRoot = path.join(path.dirname(__filename));

const isProduction = process.env.NODE_ENV === "production";

/* ====== Moving Static Files ===== */
let moveStaticFiles =  () => {
  return gulp.src(["./assets/*.*","./assets/**/*.*"])
  .pipe(gulp.dest("./dist/"));
};
moveStaticFiles.displayName = "Moving Static Files";

/* ====== REMOVE JS FILES ===== */
let clearJsFile =  () => {
  return gulp.src([
    "./dist/*.js",
    "./dist/**/*.js",
    "./dist/*.js.map",
    "./dist/**/*.js.map"
  ])
  .pipe(clean());
};
clearJsFile.displayName = "Clearing JS Files";

/* ====== COMPILE JS SCRIPT ===== */
let compileJavascript =  (done) => {
  let builder = browserify('src/index.js', {debug: true})
    .transform(babelify, {
      presets: [
        "@babel/preset-env",
        "@babel/preset-react"
      ],
      sourceMaps: !isProduction
    } )
    .on('error', (err) => {
      console.log("====================");
      console.log("Error during compile");
      console.log("====================");
      console.error(err);
      done();
    } )
    .bundle()
    .pipe(source('script.js'))
    .pipe(buffer());
  if ( isProduction ){
    builder = builder.pipe(uglify());
  }
  else {
    builder = builder
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(sourcemaps.write('./'));
  }
  builder
    .pipe(gulp.dest("./dist/js/"))
    .on('end', done);
};
compileJavascript.displayName = "Compiling Javascript";

/* ====== COMPILE SASS SCRIPT ===== */
let compileSass =  (done) => {
  return gulp.src('./src/sass/style.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('./dist/css/'));
};
compileSass.displayName = "Compiling SASS";

let watch = () => {
  if ( !isProduction ){
    gulp.watch(['src/*.js','src/**/*.js'], gulp.series(clearJsFile, compileJavascript, moveStaticFiles));
    gulp.watch(['src/*.scss','src/**/*.scss'], gulp.series(compileSass, moveStaticFiles));
  }
  else {
    return gulp.src('./src').pipe(noop());
  }
};
if ( !isProduction ){
  watch.displayName = "Watching for Changes";
} else {
  watch.displayName = "Finishing Tasks";
}

export default gulp.series(clearJsFile, compileJavascript, compileSass, moveStaticFiles, watch);
