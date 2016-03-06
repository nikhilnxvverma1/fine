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
                return RootModel;
            }());
            exports_1("RootModel", RootModel);
        }
    }
});
//# sourceMappingURL=root-model.js.map