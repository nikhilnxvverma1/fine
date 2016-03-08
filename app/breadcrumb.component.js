System.register(['angular2/core', "./core/data.service", "./core/root-model", "./core/context", "./context.component"], function(exports_1, context_1) {
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
    var core_1, data_service_1, root_model_1, core_2, context_2, core_3, context_component_1, core_4, core_5;
    var BreadcrumbComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
                core_2 = core_1_1;
                core_3 = core_1_1;
                core_4 = core_1_1;
                core_5 = core_1_1;
            },
            function (data_service_1_1) {
                data_service_1 = data_service_1_1;
            },
            function (root_model_1_1) {
                root_model_1 = root_model_1_1;
            },
            function (context_2_1) {
                context_2 = context_2_1;
            },
            function (context_component_1_1) {
                context_component_1 = context_component_1_1;
            }],
        execute: function() {
            BreadcrumbComponent = (function () {
                //@Input('dataService') public _dataService:DataService;
                function BreadcrumbComponent(_dataService, _changeDetectorRef, _zone) {
                    this._dataService = _dataService;
                    this._changeDetectorRef = _changeDetectorRef;
                    this._zone = _zone;
                    this.openDir = new core_3.EventEmitter();
                    this.message = [];
                    //var timeOut = setInterval(()=> {
                    //    this.message.push(Math.floor(Math.random() * 1000) + 1+": random");
                    //}, 1000);
                    //var dialog=require('dialog');
                    //dialog.showErrorBox('test', 'test');
                }
                BreadcrumbComponent.prototype.ngOnChanges = function (changes) {
                    console.log("Changes made" + this.contextStack.length);
                    return undefined;
                };
                BreadcrumbComponent.prototype.openRoot = function () {
                    var _this = this;
                    //this.message.push(Math.floor(Math.random() * 1000) + 1+": random");
                    var remote = require('remote');
                    var dialog = remote.require('dialog');
                    // /Users/NikhilVerma/Documents/Laying bricks
                    dialog.showOpenDialog({ properties: ['openDirectory'] }, function (folderToOpen) {
                        _this._zone.run(function () {
                            //console.log("length of data items"+dataItems1.length);
                            if (folderToOpen == null)
                                return;
                            var dataItems = _this._dataService.readDirectory(folderToOpen[0]); //this also needs to happen inside ng zone
                            _this.rootModel.rootDirectory = folderToOpen[0];
                            //create a new context holding the value of the root now
                            var context = new context_2.Context(); //null context meaning root
                            context.dataItems = dataItems;
                            //this.rootModel.contextStack.splice(0,this.rootModel.contextStack.length);
                            //this.rootModel.contextStack.push(context);
                            _this.contextStack.splice(0, _this.rootModel.contextStack.length);
                            _this.contextStack.push(context);
                            console.log('RootModel Model folder: ' + _this.rootModel.rootDirectory);
                            //this._changeDetectorRef.detectChanges();
                            _this.message.push(Math.floor(Math.random() * 1000) + 1 + ": random");
                        });
                    });
                };
                BreadcrumbComponent.prototype.backTo = function (context) {
                    var index = this.contextStack.indexOf(context);
                    if (index == this.contextStack.length - 1)
                        return;
                    this.contextStack.splice(index + 1, this.contextStack.length);
                };
                BreadcrumbComponent.prototype.addNewContext = function (folder) {
                    console.log("will open folder" + folder.name);
                    this.openDir.emit(folder);
                };
                __decorate([
                    core_2.Input('rootModel'), 
                    __metadata('design:type', root_model_1.RootModel)
                ], BreadcrumbComponent.prototype, "rootModel", void 0);
                __decorate([
                    core_2.Input('contextStack'), 
                    __metadata('design:type', Array)
                ], BreadcrumbComponent.prototype, "contextStack", void 0);
                __decorate([
                    core_3.Output('opendir'), 
                    __metadata('design:type', core_3.EventEmitter)
                ], BreadcrumbComponent.prototype, "openDir", void 0);
                BreadcrumbComponent = __decorate([
                    core_1.Component({
                        //inputs:['rootModel'],
                        selector: 'breadcrumb',
                        directives: [context_component_1.ContextComponent],
                        templateUrl: 'app/template/breadcrumb.component.html',
                        providers: [core_4.ChangeDetectorRef]
                    }), 
                    __metadata('design:paramtypes', [data_service_1.DataService, core_4.ChangeDetectorRef, core_5.NgZone])
                ], BreadcrumbComponent);
                return BreadcrumbComponent;
            }());
            exports_1("BreadcrumbComponent", BreadcrumbComponent);
        }
    }
});
//# sourceMappingURL=breadcrumb.component.js.map