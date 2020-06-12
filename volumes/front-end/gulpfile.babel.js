"use strict";
import gulp from "gulp";
import browserify from "browserify";
import babelify from "babelify";
import source from 'vinyl-source-stream';
import clean from 'gulp-clean';

/* ====== Moving Static Files ===== */
var moveStaticFiles =  () => {
  return gulp.src(["./assets/*.*","./assets/**/*.*"])
  .pipe(gulp.dest("./dist/"));
};
moveStaticFiles.displayName = "Moving Static Files";

/* ====== REMOVE JS FILES ===== */
var clearJsFile =  () => {
  return gulp.src(["./dist/*.js","./dist/**/*.js"])
  .pipe(clean());
};
clearJsFile.displayName = "Clearing JS Files";

/* ====== COMPILE JS SCRIPT ===== */
var compileJavascript =  (done) => {
  browserify('src/index.js')
  .transform(babelify, {
    presets: [
      "@babel/preset-env",
      "@babel/preset-react"
    ],
    sourceMaps: true
  } )
  .bundle()
  .pipe(source('script.js'))
  .pipe(gulp.dest("./dist/js/"))
  .on('error', (err) => {
    console.log("====================");
    console.log("Error during compile");
    console.log("====================");
    console.error(err);
    done();
  } )
  .on('end', () => {
    done();
  } );
};
compileJavascript.displayName = "Compiling Javascript";

/* ====== COMPILE SASS SCRIPT ===== */
var compileSass =  (done) => {
  done();
};
compileSass.displayName = "Compiling SASS";

var watch = () => {
  gulp.watch(['src/*.js','src/**/*.js'], gulp.series(clearJsFile, compileJavascript, moveStaticFiles));
  gulp.watch(['src/sass/*.scss','src/sass/**/*.scss'], gulp.series(compileSass, moveStaticFiles));
};
watch.displayName = "Watching for Changes";

export default gulp.series(clearJsFile, compileJavascript, compileSass, moveStaticFiles, watch);
