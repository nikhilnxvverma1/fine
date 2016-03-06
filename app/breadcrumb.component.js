System.register(['angular2/core', "./core/data.service", "./core/context", "./core/data"], function(exports_1, context_1) {
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
    var core_1, data_service_1, context_2, data_1;
    var BreadcrumbComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (data_service_1_1) {
                data_service_1 = data_service_1_1;
            },
            function (context_2_1) {
                context_2 = context_2_1;
            },
            function (data_1_1) {
                data_1 = data_1_1;
            }],
        execute: function() {
            BreadcrumbComponent = (function () {
                function BreadcrumbComponent(_dataService) {
                    this._dataService = _dataService;
                }
                BreadcrumbComponent.prototype.openRoot = function () {
                    var _this = this;
                    var remote = require('remote');
                    var dialog = remote.require('dialog');
                    dialog.showOpenDialog({ properties: ['openDirectory'] }, function (folderToOpen) {
                        var dataItems = _this._dataService.readDirectory(folderToOpen[0]);
                        _this.rootModel.rootDirectory = folderToOpen[0];
                        //create a new context holding the value of the root now
                        var context = new context_2.Context(); //null context meaning root
                        context.data = new data_1.Data(dataItems);
                        _this.rootModel.contextStack.splice(0, _this.rootModel.contextStack.length);
                        _this.rootModel.contextStack.push(context);
                        console.log('RootModel Model folder: ' + _this.rootModel.rootDirectory);
                    });
                };
                BreadcrumbComponent = __decorate([
                    core_1.Component({
                        inputs: ['rootModel'],
                        selector: 'breadcrumb',
                        templateUrl: 'app/template/breadcrumb.component.html'
                    }), 
                    __metadata('design:paramtypes', [data_service_1.DataService])
                ], BreadcrumbComponent);
                return BreadcrumbComponent;
            }());
            exports_1("BreadcrumbComponent", BreadcrumbComponent);
        }
    }
});
//# sourceMappingURL=breadcrumb.component.js.map