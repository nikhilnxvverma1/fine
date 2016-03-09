System.register(['angular2/core', "./core/context", "./selection-field.component", "./data-area.component", "./info-box.component"], function(exports_1, context_1) {
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
    var core_1, core_2, context_2, selection_field_component_1, data_area_component_1, info_box_component_1, core_3;
    var ContextComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
                core_2 = core_1_1;
                core_3 = core_1_1;
            },
            function (context_2_1) {
                context_2 = context_2_1;
            },
            function (selection_field_component_1_1) {
                selection_field_component_1 = selection_field_component_1_1;
            },
            function (data_area_component_1_1) {
                data_area_component_1 = data_area_component_1_1;
            },
            function (info_box_component_1_1) {
                info_box_component_1 = info_box_component_1_1;
            }],
        execute: function() {
            ContextComponent = (function () {
                function ContextComponent() {
                    this.openDataItemEvent = new core_3.EventEmitter();
                }
                ContextComponent.prototype.openDataItem = function (dataItem) {
                    console.log("will open folder" + dataItem.name);
                    this.openDataItemEvent.emit(dataItem);
                };
                ContextComponent.prototype.incrementDataItemsQualifying = function (tag) {
                    console.log('will increment items qualifiying ' + tag.name);
                    this.matchForTagAndAdd(tag, 1);
                };
                ContextComponent.prototype.decrementDataItemsQualifying = function (tag) {
                    console.log('will decrement items qualifiying ' + tag.name);
                    this.matchForTagAndAdd(tag, -1);
                };
                ContextComponent.prototype.matchForTagAndAdd = function (tag, increment) {
                    for (var i = 0; i < this.context.dataItems.length; i++) {
                        var dataItem = this.context.dataItems[i];
                        var dataItemName = dataItem.name.toLowerCase();
                        var tagName = tag.name.toLowerCase();
                        var position = dataItemName.search(tagName);
                        if (position != -1) {
                            dataItem.qualifyingTags += increment;
                        }
                    }
                    console.log("List o selected files are :");
                    var selected = this.context.getSelectedFiles();
                    for (var i = 0; i < selected.length; i++) {
                        console.log(selected[i].name);
                    }
                };
                __decorate([
                    core_2.Input('context'), 
                    __metadata('design:type', context_2.Context)
                ], ContextComponent.prototype, "context", void 0);
                __decorate([
                    core_3.Output('opendataitem'), 
                    __metadata('design:type', core_3.EventEmitter)
                ], ContextComponent.prototype, "openDataItemEvent", void 0);
                ContextComponent = __decorate([
                    core_1.Component({
                        selector: 'folder-context',
                        directives: [selection_field_component_1.SelectionFieldComponent, data_area_component_1.DataAreaComponent, info_box_component_1.InfoBoxComponent],
                        templateUrl: 'app/template/context.component.html',
                    }), 
                    __metadata('design:paramtypes', [])
                ], ContextComponent);
                return ContextComponent;
            }());
            exports_1("ContextComponent", ContextComponent);
        }
    }
});
//# sourceMappingURL=context.component.js.map