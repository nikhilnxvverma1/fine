System.register(["./tag"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var tag_1;
    var SelectionTag;
    return {
        setters:[
            function (tag_1_1) {
                tag_1 = tag_1_1;
            }],
        execute: function() {
            SelectionTag = (function (_super) {
                __extends(SelectionTag, _super);
                function SelectionTag() {
                    this.name = "\"Selection\"";
                }
                return SelectionTag;
            }(tag_1.Tag));
            exports_1("SelectionTag", SelectionTag);
        }
    }
});
//# sourceMappingURL=selection-tag.js.map