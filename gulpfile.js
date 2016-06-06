// get the dependencies
var gulp        = require('gulp'), 
  childProcess  = require('child_process'), 
  electron      = require('electron-prebuilt');
var shell = require('gulp-shell');
var sass = require('gulp-sass');
var watch = require('gulp-watch');

var paths = {
  'src':['package.json']

  ,
  'style': {
    all: './sass/style.scss',
    output: './css'
  },
  'typescript':{

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

// create the gulp task
gulp.task('run-no-electron-env', function () {
  childProcess.spawn(electron, ['--debug=5858','./app'], { stdio: 'inherit' });
});

gulp.task('run',shell.task('electron main.js'));

gulp.task('default',['watch:sass','run']);