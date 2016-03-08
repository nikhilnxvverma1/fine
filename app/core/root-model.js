System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var RootModel;
    return {
        setters:[],
        execute: function() {
            //@Injectable()
            RootModel = (function () {
                function RootModel() {
                    this.contextStack = [];
                }
                RootModel.prototype.getFullPathTillEnd = function () {
                    var fullPath = this.rootDirectory;
                    for (var i = 0; i < this.contextStack.length; i++) {
                        var context = this.contextStack[i];
                        if (context.parentFolder != null) {
                            fullPath += '/' + context.parentFolder.name;
                        }
                    }
                    console.log('full path:' + fullPath);
                    return fullPath;
                };
                return RootModel;
            }());
            exports_1("RootModel", RootModel);
        }
    }
});
//# sourceMappingURL=root-model.js.map