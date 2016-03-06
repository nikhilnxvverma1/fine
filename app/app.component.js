System.register(['angular2/core', './core/data.service', "./info-box.component", "./data-area.component"], function(exports_1, context_1) {
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
    var core_1, data_service_1, info_box_component_1, data_area_component_1;
    var AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (data_service_1_1) {
                data_service_1 = data_service_1_1;
            },
            function (info_box_component_1_1) {
                info_box_component_1 = info_box_component_1_1;
            },
            function (data_area_component_1_1) {
                data_area_component_1 = data_area_component_1_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent(_dataService) {
                    this._dataService = _dataService;
                }
                AppComponent.prototype.ngOnInit = function () {
                    //dom initializations
                    //noinspection TypeScriptUnresolvedFunction
                    $('.collapsible').collapsible({
                        accordion: false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
                    });
                };
                AppComponent.prototype.openRoot = function () {
                    var _this = this;
                    var remote = require('remote');
                    var dialog = remote.require('dialog');
                    dialog.showOpenDialog({ properties: ['openDirectory'] }, function (folderToOpen) {
                        console.log('Root folder: ' + folderToOpen);
                        _this._dataService.readDirectory(folderToOpen[0]);
                    });
                };
                AppComponent = __decorate([
                    core_1.Component({
                        selector: 'app',
                        templateUrl: 'app/template/app.component.html',
                        providers: [data_service_1.DataService],
                        directives: [data_area_component_1.DataAreaComponent, info_box_component_1.InfoBoxComponent],
                    }), 
                    __metadata('design:paramtypes', [data_service_1.DataService])
                ], AppComponent);
                return AppComponent;
            }());
            exports_1("AppComponent", AppComponent);
        }
    }
});
//# sourceMappingURL=app.component.js.map