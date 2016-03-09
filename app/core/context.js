System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Context;
    return {
        setters:[],
        execute: function() {
            Context = (function () {
                function Context() {
                    this.tags = [];
                }
                Context.prototype.getSelectedFiles = function () {
                    var selectedDataItems = [];
                    for (var i = 0; i < this.dataItems.length; i++) {
                        if (this.dataItems[i].qualifyingTags > 0) {
                            selectedDataItems.push(this.dataItems[i]);
                        }
                    }
                    return selectedDataItems;
                };
                return Context;
            }());
            exports_1("Context", Context);
        }
    }
});
//# sourceMappingURL=context.js.map