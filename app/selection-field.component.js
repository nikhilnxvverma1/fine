System.register(['angular2/core', "./core/text-tag"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, core_2, text_tag_1, core_3, core_4;
    var SelectionFieldComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
                core_2 = core_1_1;
                core_3 = core_1_1;
                core_4 = core_1_1;
            },
            function (text_tag_1_1) {
                text_tag_1 = text_tag_1_1;
            }],
        execute: function() {
            SelectionFieldComponent = (function () {
                function SelectionFieldComponent() {
                    this.tagAddedEvent = new core_4.EventEmitter();
                    this.tagRemovedEvent = new core_4.EventEmitter();
                }
                SelectionFieldComponent.prototype.addTagOnSpace = function (keyboardEvent) {
                    if (keyboardEvent.keyCode == 32 || keyboardEvent.keyCode == 13 || keyboardEvent.keyCode == 188) {
                        //add tag for the current input
                        //but
                        //cut out the last character because it was delimiter
                        var inputText = this.currentInput.substr(0, this.currentInput.length - 1);
                        this.addTag(inputText);
                        this.currentInput = "";
                    }
                };
                SelectionFieldComponent.prototype.addTag = function (tagText) {
                    var textTag = new text_tag_1.TextTag(tagText);
                    this.tags.push(textTag);
                    //make selections by configuring output back to the context-component
                    this.tagAddedEvent.emit(textTag);
                };
                SelectionFieldComponent.prototype.removeTag = function (tag) {
                    console.log("Removing tag " + tag.name);
                    var index = this.tags.indexOf(tag);
                    this.tags.splice(index, 1);
                    //make selections by configuring output back to the context-component
                    this.tagRemovedEvent.emit(tag);
                };
                __decorate([
                    core_2.Input('tags'), 
                    __metadata('design:type', Array)
                ], SelectionFieldComponent.prototype, "tags", void 0);
                __decorate([
                    core_3.Output('tagadded'), 
                    __metadata('design:type', core_4.EventEmitter)
                ], SelectionFieldComponent.prototype, "tagAddedEvent", void 0);
                __decorate([
                    core_3.Output('tagremoved'), 
                    __metadata('design:type', core_4.EventEmitter)
                ], SelectionFieldComponent.prototype, "tagRemovedEvent", void 0);
                SelectionFieldComponent = __decorate([
                    core_1.Component({
                        selector: 'selection-field',
                        templateUrl: 'app/template/selection-field.component.html'
                    }), 
                    __metadata('design:paramtypes', [])
                ], SelectionFieldComponent);
                return SelectionFieldComponent;
            }());
            exports_1("SelectionFieldComponent", SelectionFieldComponent);
        }
    }
});
//# sourceMappingURL=selection-field.component.js.map