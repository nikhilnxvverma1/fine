System.register(['angular2/core', "./folder", "./file"], function(exports_1, context_1) {
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
    var core_1, folder_1, file_1, core_2;
    var DataService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
                core_2 = core_1_1;
            },
            function (folder_1_1) {
                folder_1 = folder_1_1;
            },
            function (file_1_1) {
                file_1 = file_1_1;
            }],
        execute: function() {
            DataService = (function () {
                function DataService(_zone) {
                    this._zone = _zone;
                }
                DataService.prototype.readDirectory = function (directoryPath) {
                    var _this = this;
                    var fs = require('fs');
                    var dataItemsResult = [];
                    fs.readdir(directoryPath, function (err, dataItems) {
                        if (err)
                            throw err;
                        dataItems.forEach((function (dataItem) {
                            //dataItems.push(dataItem);
                            fs.stat(directoryPath + '/' + dataItem, function (err, stats) {
                                _this._zone.run(function () {
                                    if (err)
                                        throw err;
                                    //console.log("name : "+dataItem+" is direcotyr"+stats.isDirectory());
                                    if (stats.isDirectory()) {
                                        var folder = new folder_1.Folder(dataItem, stats);
                                        dataItemsResult.push(folder);
                                    }
                                    else {
                                        var file = new file_1.File(dataItem, stats);
                                        dataItemsResult.push(file);
                                    }
                                });
                            });
                        }));
                    });
                    return dataItemsResult;
                };
                DataService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [core_2.NgZone])
                ], DataService);
                return DataService;
            }());
            exports_1("DataService", DataService);
        }
    }
});
//# sourceMappingURL=data.service.js.map