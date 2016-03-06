System.register(['./data-item'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var data_item_1;
    var File;
    return {
        setters:[
            function (data_item_1_1) {
                data_item_1 = data_item_1_1;
            }],
        execute: function() {
            File = (function (_super) {
                __extends(File, _super);
                function File() {
                    _super.apply(this, arguments);
                }
                return File;
            }(data_item_1.DataItem));
            exports_1("File", File);
        }
    }
});
//# sourceMappingURL=file.js.map