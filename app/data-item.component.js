System.register(['angular2/core'], function(exports_1, context_1) {
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
    var core_1, core_2, core_3, core_4;
    var DataItemComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
                core_2 = core_1_1;
                core_3 = core_1_1;
                core_4 = core_1_1;
            }],
        execute: function() {
            DataItemComponent = (function () {
                function DataItemComponent() {
                    this.openDataItemEvent = new core_4.EventEmitter();
                }
                DataItemComponent.prototype.openDataItem = function (dataItem) {
                    this.openDataItemEvent.emit(dataItem);
                };
                __decorate([
                    core_2.Input('dataItem'), 
                    __metadata('design:type', Object)
                ], DataItemComponent.prototype, "dataItem", void 0);
                __decorate([
                    core_3.Output('opendataitem'), 
                    __metadata('design:type', core_4.EventEmitter)
                ], DataItemComponent.prototype, "openDataItemEvent", void 0);
                DataItemComponent = __decorate([
                    core_1.Component({
                        selector: 'data-item',
                        templateUrl: 'app/template/data-item.component.html'
                    }), 
                    __metadata('design:paramtypes', [])
                ], DataItemComponent);
                return DataItemComponent;
            }());
            exports_1("DataItemComponent", DataItemComponent);
        }
    }
});
//# sourceMappingURL=data-item.component.js.map