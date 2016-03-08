System.register(['angular2/core', './core/data.service', "./breadcrumb.component", "./core/root-model", "./core/context", "./context.component"], function(exports_1, context_1) {
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
    var core_1, data_service_1, breadcrumb_component_1, root_model_1, context_2, context_component_1;
    var AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (data_service_1_1) {
                data_service_1 = data_service_1_1;
            },
            function (breadcrumb_component_1_1) {
                breadcrumb_component_1 = breadcrumb_component_1_1;
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
            AppComponent = (function () {
                function AppComponent() {
                    this.rootModel = new root_model_1.RootModel();
                    //this is a patch for not having injections possible across multiple components
                    //we should't "new" services
                    this._dataService = new data_service_1.DataService();
                    this.rootModel = new root_model_1.RootModel();
                }
                AppComponent.prototype.ngOnInit = function () {
                    //dom initializations
                    //noinspection TypeScriptUnresolvedFunction
                    $('.collapsible').collapsible({
                        accordion: false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
                    });
                };
                AppComponent.prototype.openDirectory = function (folder) {
                    console.log("about to open folder" + folder.name);
                    var dataItems = this._dataService.readDirectory(this.rootModel.getFullPathTillEnd() + '/' + folder.name);
                    var context = new context_2.Context(); //null context meaning root
                    context.dataItems = dataItems;
                    context.parentFolder = folder;
                    //this.rootModel.contextStack.splice(0,this.rootModel.contextStack.length);
                    this.rootModel.contextStack.push(context);
                };
                AppComponent = __decorate([
                    core_1.Component({
                        selector: 'app',
                        templateUrl: 'app/template/app.component.html',
                        providers: [data_service_1.DataService],
                        directives: [
                            breadcrumb_component_1.BreadcrumbComponent,
                            context_component_1.ContextComponent
                        ],
                    }), 
                    __metadata('design:paramtypes', [])
                ], AppComponent);
                return AppComponent;
            }());
            exports_1("AppComponent", AppComponent);
        }
    }
});
//# sourceMappingURL=app.component.js.map