"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackPlayerDownloadManager = void 0;
exports.useTrackPlayerCurrentDownloadsCached = useTrackPlayerCurrentDownloadsCached;
exports.useTrackPlayerDownloadCached = useTrackPlayerDownloadCached;
exports.useTrackPlayerDownloadsCached = useTrackPlayerDownloadsCached;
var react_1 = require("react");
var interfaces_1 = require("./interfaces");
var trackPlayer_1 = require("./trackPlayer");
var TrackPlayerDownloadManager = /** @class */ (function () {
    function TrackPlayerDownloadManager() {
        this.downloadChangeSubscriptions = new Map();
        this.downloadsChangeSubscriptions = [];
        this.downloads = new Map();
        this.subscriptions = [];
    }
    TrackPlayerDownloadManager.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.connect();
                        return [4 /*yield*/, this.load()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TrackPlayerDownloadManager.prototype.destroy = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.subscriptions.forEach(function (sub) { return sub.remove(); });
                this.subscriptions = [];
                return [2 /*return*/];
            });
        });
    };
    TrackPlayerDownloadManager.prototype.connect = function () {
        var _this = this;
        this.subscriptions.push(trackPlayer_1.default.addEventListener(interfaces_1.Event.DownloadChanged, function (_a) {
            var id = _a.id, state = _a.state;
            _this.updateDownload(id, state).catch(console.error);
        }));
        this.subscriptions.push(trackPlayer_1.default.addEventListener(interfaces_1.Event.DownloadProgressChanged, function (_a) {
            var id = _a.id, contentLength = _a.contentLength, bytesDownloaded = _a.bytesDownloaded, percentDownloaded = _a.percentDownloaded;
            _this.updateDownloadProgress(id, contentLength, bytesDownloaded, percentDownloaded).catch(console.error);
        }));
    };
    TrackPlayerDownloadManager.prototype.getDownload = function (id) {
        return this.downloads.get(id);
    };
    TrackPlayerDownloadManager.prototype.getDownloads = function () {
        return Array.from(this.downloads.values());
    };
    TrackPlayerDownloadManager.prototype.getCurrentDownloads = function () {
        return this.getDownloads().filter(function (d) { return d.state !== interfaces_1.DownloadState.Completed; });
    };
    TrackPlayerDownloadManager.prototype.updateDownload = function (id, state) {
        return __awaiter(this, void 0, void 0, function () {
            var download;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(state === interfaces_1.DownloadState.Removing)) return [3 /*break*/, 1];
                        this.downloads.delete(id);
                        this.notifyDownloadsChange();
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, trackPlayer_1.default.getDownload(id)];
                    case 2:
                        download = _a.sent();
                        if (!download) {
                            this.downloads.delete(id);
                        }
                        else {
                            this.downloads.set(id, download);
                        }
                        this.notifyDownloadsChange();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TrackPlayerDownloadManager.prototype.updateDownloadProgress = function (id, contentLength, bytesDownloaded, percentDownloaded) {
        return __awaiter(this, void 0, void 0, function () {
            var download;
            return __generator(this, function (_a) {
                download = this.downloads.get(id);
                if (download) {
                    download.contentLength = contentLength;
                    download.bytesDownloaded = bytesDownloaded;
                    download.percentDownloaded = percentDownloaded;
                    this.notifyDownloadChange(download);
                }
                return [2 /*return*/];
            });
        });
    };
    TrackPlayerDownloadManager.prototype.load = function () {
        return __awaiter(this, void 0, void 0, function () {
            var downloads, _i, downloads_1, download;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, trackPlayer_1.default.getDownloads()];
                    case 1:
                        downloads = _a.sent();
                        this.downloads.clear();
                        for (_i = 0, downloads_1 = downloads; _i < downloads_1.length; _i++) {
                            download = downloads_1[_i];
                            this.downloads.set(download.id, download);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    TrackPlayerDownloadManager.prototype.clear = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, trackPlayer_1.default.clearDownloads()];
                    case 1:
                        _a.sent();
                        this.notifyDownloadsChange();
                        return [2 /*return*/];
                }
            });
        });
    };
    TrackPlayerDownloadManager.prototype.setHeaders = function (headers) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, trackPlayer_1.default.setDownloadHeaders(headers)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TrackPlayerDownloadManager.prototype.download = function (requests) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, trackPlayer_1.default.addDownloads(requests)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TrackPlayerDownloadManager.prototype.remove = function (ids) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, ids_1, id;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _i = 0, ids_1 = ids;
                        _a.label = 1;
                    case 1:
                        if (!(_i < ids_1.length)) return [3 /*break*/, 4];
                        id = ids_1[_i];
                        return [4 /*yield*/, trackPlayer_1.default.removeDownload(id)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        this.notifyDownloadsChange();
                        return [2 /*return*/];
                }
            });
        });
    };
    TrackPlayerDownloadManager.prototype.subscribeDownloadsChanges = function (listen) {
        this.downloadsChangeSubscriptions.push(listen);
    };
    TrackPlayerDownloadManager.prototype.unsubscribeDownloadsChanges = function (listen) {
        this.downloadsChangeSubscriptions = this.downloadsChangeSubscriptions.filter(function (u) { return u !== listen; });
    };
    TrackPlayerDownloadManager.prototype.notifyDownloadsChange = function () {
        var list = this.getDownloads();
        this.downloadsChangeSubscriptions.forEach(function (update) { return update(list); });
    };
    TrackPlayerDownloadManager.prototype.subscribeDownloadChange = function (id, update) {
        var array = this.downloadChangeSubscriptions.get(id) || [];
        array.push(update);
        this.downloadChangeSubscriptions.set(id, array);
    };
    TrackPlayerDownloadManager.prototype.unsubscribeDownloadChange = function (id, update) {
        var array = this.downloadChangeSubscriptions.get(id) || [];
        array = array.splice(array.indexOf(update), 1);
        if (array.length === 0) {
            this.downloadChangeSubscriptions.delete(id);
        }
        else {
            this.downloadChangeSubscriptions.set(id, array);
        }
    };
    TrackPlayerDownloadManager.prototype.notifyDownloadChange = function (download) {
        var listeners = this.downloadChangeSubscriptions.get(download.id);
        if (listeners) {
            listeners.forEach(function (update) { return update(download); });
        }
    };
    return TrackPlayerDownloadManager;
}());
exports.TrackPlayerDownloadManager = TrackPlayerDownloadManager;
function useTrackPlayerCurrentDownloadsCached(cache) {
    var _a = (0, react_1.useState)(undefined), data = _a[0], setData = _a[1];
    var isUnmountedRef = (0, react_1.useRef)(true);
    (0, react_1.useEffect)(function () {
        isUnmountedRef.current = false;
        return function () {
            isUnmountedRef.current = true;
        };
    }, []);
    (0, react_1.useEffect)(function () {
        var refresh = function (downloads) {
            var ds = downloads ?
                downloads.filter(function (d) { return d.state !== interfaces_1.DownloadState.Completed; })
                : cache.getCurrentDownloads();
            if (isUnmountedRef.current) {
                return;
            }
            setData(ds);
        };
        cache.subscribeDownloadsChanges(refresh);
        refresh();
        return function () {
            cache.unsubscribeDownloadsChanges(refresh);
        };
    }, [cache]);
    return data;
}
function useTrackPlayerDownloadCached(id, cache) {
    var _a = (0, react_1.useState)(undefined), data = _a[0], setData = _a[1];
    var isUnmountedRef = (0, react_1.useRef)(true);
    (0, react_1.useEffect)(function () {
        isUnmountedRef.current = false;
        return function () {
            isUnmountedRef.current = true;
        };
    }, []);
    (0, react_1.useEffect)(function () {
        var refresh = function (download) {
            var d = download ? download : cache.getDownload(id);
            if (isUnmountedRef.current) {
                return;
            }
            setData(d);
        };
        cache.subscribeDownloadChange(id, refresh);
        refresh();
        return function () {
            cache.unsubscribeDownloadChange(id, refresh);
        };
    }, [id, cache]);
    return data;
}
function useTrackPlayerDownloadsCached(cache) {
    var _a = (0, react_1.useState)(undefined), data = _a[0], setData = _a[1];
    var isUnmountedRef = (0, react_1.useRef)(true);
    (0, react_1.useEffect)(function () {
        isUnmountedRef.current = false;
        return function () {
            isUnmountedRef.current = true;
        };
    }, []);
    (0, react_1.useEffect)(function () {
        var refresh = function (downloads) {
            var ds = downloads ?
                downloads
                : cache.getDownloads();
            if (isUnmountedRef.current) {
                return;
            }
            setData(ds);
        };
        cache.subscribeDownloadsChanges(refresh);
        refresh();
        return function () {
            cache.unsubscribeDownloadsChanges(refresh);
        };
    }, [cache]);
    return data;
}
