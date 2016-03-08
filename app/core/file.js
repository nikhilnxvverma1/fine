System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var File;
    return {
        setters:[],
        execute: function() {
            File = (function () {
                //metadata about folder
                function File(_name, _stats) {
                    this.name = _name;
                    this.isDirectory = false;
                    this.stats = _stats;
                    this.selected = false;
                }
                return File;
            }());
            exports_1("File", File);
        }
    }
});
//# sourceMappingURL=file.js.map