System.register(["./tag"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var tag_1;
    var TextTag;
    return {
        setters:[
            function (tag_1_1) {
                tag_1 = tag_1_1;
            }],
        execute: function() {
            TextTag = (function (_super) {
                __extends(TextTag, _super);
                function TextTag(t) {
                    this.text = t;
                    this.name = t;
                }
                return TextTag;
            }(tag_1.Tag));
            exports_1("TextTag", TextTag);
        }
    }
});
//# sourceMappingURL=text-tag.js.map