var gulp        = require('gulp');
var electron      = require('electron');
var shell = require('gulp-shell');
var yargs = require('yargs');
var dummyGenerator=require('./dummy-generator');

gulp.task('dummy',function(){
	var argv=yargs
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
		.epilog('This utility is used only for development and testing purposes.')
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

gulp.task('watch:client',shell.task('ng build -o dist -w'));
gulp.task('run',shell.task('electron main.js'));

gulp.task('default',['watch:client','run']);