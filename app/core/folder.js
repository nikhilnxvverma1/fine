System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Folder;
    return {
        setters:[],
        execute: function() {
            Folder = (function () {
                //metadata about folder
                function Folder(_name, _stats) {
                    this.name = _name;
                    this.isDirectory = true;
                    this.stats = _stats;
                }
                return Folder;
            }());
            exports_1("Folder", Folder);
        }
    }
});
//# sourceMappingURL=folder.js.map