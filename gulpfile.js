// get the dependencies
var gulp        = require('gulp'), 
  childProcess  = require('child_process'), 
  electron      = require('electron-prebuilt');
var shell = require('gulp-shell');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var ts=require('gulp-typescript');
var sourcemaps=require('gulp-sourcemaps');

var paths = {
  'src':['package.json']

  ,
  'style': {
    all: './sass/style.scss',
    output: './css'
  },
  'typescript':{
    src: './app-ts/**/*.ts',
    output:'./app-js',
    sourcemaps:'./sourcemaps'
  }
};

gulp.task('watch:sass', function () {
  gulp.watch(paths.style.all, ['sass']);
});

gulp.task('sass', function(){
  gulp.src(paths.style.all)
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest(paths.style.output));
});

gulp.task('watch:typescript',function(){
  gulp.watch(paths.typescript.src,['typescript']);
});

gulp.task('typescript',function(){
  return gulp.src(paths.typescript.src)
      .pipe(sourcemaps.init())
      .pipe(ts({
        noImplicitAny: false,
        rootDir:'./app-ts',
        outDir:'./app-js'
      }))
      .pipe(sourcemaps.write(paths.typescript.sourcemaps))
      .pipe(gulp.dest(paths.typescript.output));
});

// create the gulp task
gulp.task('run-no-electron-env', function () {
  childProcess.spawn(electron, ['--debug=5858','./app'], { stdio: 'inherit' });
});

gulp.task('run',shell.task('electron main.js'));

gulp.task('default',['watch:sass','watch:typescript','run']);