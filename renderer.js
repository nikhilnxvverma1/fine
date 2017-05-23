// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

//Materialize Dependencies
window.$=window.JQuery=require('./js/jquery-2.1.1.min.js')
var Hammer=require('./js/hammer-2.0.6.min.js');
require('./js/bin/materialize.min.js');

//angular js dependencies
require('./dist/inline.bundle.js');
require('./dist/polyfills.bundle.js');
require('./dist/styles.bundle.js');
require('./dist/vendor.bundle.js');
require('./dist/main.bundle.js');

//Monaco editor dependencies
require.config({ paths: { 'vs': 'monaco-editor/min/vs' }});
	require(['vs/editor/editor.main'], function() {
		var editor = monaco.editor.create(document.getElementById('container'), {
			value: [
				'function x() {',
				'\tconsole.log("Hello world!");',
				'}'
			].join('\n'),
			language: 'javascript'
		});
	});