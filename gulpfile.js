// get the dependencies
var gulp        = require('gulp'), 
  childProcess  = require('child_process'), 
  electron      = require('electron-prebuilt');
var shell = require('gulp-shell');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var ts=require('gulp-typescript');
var sourcemaps=require('gulp-sourcemaps');
var dummyGenerator=require('./dummy-generator');

gulp.task('dummy',function(){
    var argv=require('yargs')
        .usage("Usage: $0 dummy -d \<num\> [-f \<num\> -o \<num\>]")
        .command('dummyGenerator','Creates a random file structure with dummy files and folders.')
        .example('gulp dummy --depth 6 --maxFilesPerFolder 5 --maxFolderPerFolder 3',
            'Creates a random file hierarchy with a max of 6 layers of folder.' +
            ' Each layer containing upto 5 files and 3 folder(except last layer)')
        .demand(['d'])
        .alias('d','depth')
        .describe('d','Height of the file hierarchy')
        .alias('f','maxFilesPerFolder')
        .default('f',5)
        .describe('f','Maximum files per each folder')
        .alias('o','maxFolderPerFolder')
        .default('o',3)
        .describe('o','Maximum folder per each folder')
        .help('e')
        .alias('e','showHelp')
        .alias('p','path')
        .describe('p','Path where the file hierarchy will be placed (Mind the default)')
        .default('p','/Users/NikhilVerma/Desktop/')
        .alias('n','name')
        .describe('n','Name of the main dummy folder')
        .default('n','dummy')
        .epilog('copyright 2016')
        .argv;

    if(argv.d!=undefined){
        var depth=argv.d;
        var maxFilesPerFolder=argv.f;
        var maxFolderPerFolder=argv.o;
        var path=argv.p;
        var folderName=argv.n;
        dummyGenerator.dummy(depth,maxFilesPerFolder,maxFolderPerFolder,path,folderName);
    }


});

var paths = {
  'src':['package.json']

  ,
  'style': {
    all: './sass/style.scss',
    output: './css'
  },
  'typescript':{
    src: ['./app/**/*.ts'],
    rootTypescriptDir:'./app',
    outputJavascriptDir:'./app/transpiled',
    relativeSourcemaps:'./sourcemaps'
  }
};

var tsOptions={
    noImplicitAny: false,
    target:'es6',
    module:'system',
    moduleResolution:'node',
    experimentalDecorators:true,
    emitDecoratorMetadata:true,
    rootDir:paths.typescript.rootTypescriptDir,
    outDir:paths.typescript.outputJavascriptDir
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
        .pipe(ts(tsOptions))
        .pipe(sourcemaps.write(paths.typescript.relativeSourcemaps))
        .pipe(gulp.dest(paths.typescript.outputJavascriptDir));
});

// create the gulp task
gulp.task('run-no-electron-env', function () {
  childProcess.spawn(electron, ['--debug=5858','./app'], { stdio: 'inherit' });
});

gulp.task('run',shell.task('electron main.js'));

gulp.task('default',['typescript','watch:sass','watch:typescript','run']);