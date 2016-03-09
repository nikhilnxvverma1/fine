System.register(['angular2/core', "./data-item.component"], function(exports_1, context_1) {
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
    var core_1, data_item_component_1, core_2, core_3, core_4;
    var DataAreaComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
                core_2 = core_1_1;
                core_3 = core_1_1;
                core_4 = core_1_1;
            },
            function (data_item_component_1_1) {
                data_item_component_1 = data_item_component_1_1;
            }],
        execute: function() {
            DataAreaComponent = (function () {
                function DataAreaComponent() {
                    this.openDataItemEvent = new core_4.EventEmitter();
                }
                DataAreaComponent.prototype.ngOnChanges = function (changes) {
                    console.log("Changes made to the rootmodel");
                    return undefined;
                };
                DataAreaComponent.prototype.ngOnInit = function () {
                    return undefined;
                };
                DataAreaComponent.prototype.openDataItem = function (dataItem) {
                    console.log("will open data item" + dataItem.name);
                    this.openDataItemEvent.emit(dataItem);
                };
                __decorate([
                    core_2.Input('dataItems'), 
                    __metadata('design:type', Array)
                ], DataAreaComponent.prototype, "dataItems", void 0);
                __decorate([
                    core_3.Output('opendataitem'), 
                    __metadata('design:type', core_4.EventEmitter)
                ], DataAreaComponent.prototype, "openDataItemEvent", void 0);
                DataAreaComponent = __decorate([
                    core_1.Component({
                        selector: 'data-area',
                        templateUrl: 'app/template/data-area.component.html',
                        directives: [data_item_component_1.DataItemComponent]
                    }), 
                    __metadata('design:paramtypes', [])
                ], DataAreaComponent);
                return DataAreaComponent;
            }());
            exports_1("DataAreaComponent", DataAreaComponent);
        }
    }
});
//# sourceMappingURL=data-area.component.js.map