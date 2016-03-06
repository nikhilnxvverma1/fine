System.register(['./data-item'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var data_item_1;
    var Folder;
    return {
        setters:[
            function (data_item_1_1) {
                data_item_1 = data_item_1_1;
            }],
        execute: function() {
            Folder = (function (_super) {
                __extends(Folder, _super);
                function Folder() {
                    _super.apply(this, arguments);
                }
                return Folder;
            }(data_item_1.DataItem));
            exports_1("Folder", Folder);
        }
    }
});
//# sourceMappingURL=folder.js.map