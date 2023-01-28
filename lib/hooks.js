"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
exports.useTrackPlayerHasSiblings = exports.useTrackPlayerHasPrevious = exports.useTrackPlayerHasNext = exports.useTrackPlayerPlaybackPitch = exports.useTrackPlayerPlaybackSpeed = exports.useTrackPlayerPlaybackParameters = exports.useTrackPlayerRepeatMode = exports.useTrackPlayerShuffleModeEnabled = exports.useTrackPlayerProgressMS = exports.useTrackPlayerProgressPercent = exports.useTrackPlayerPlaybackStateIsPlaying = exports.useTrackPlayerPlaybackStateIs = exports.useTrackPlayerDownload = exports.useTrackPlayerCurrentDownloads = exports.useTrackPlayerDownloadsPaused = exports.useTrackPlayerDownloads = exports.useTrackPlayerQueue = exports.useTrackPlayerCurrentTrack = exports.useTrackPlayerCurrentTrackNr = exports.useTrackPlayerProgress = exports.useTrackPlayerPlaybackState = exports.useTrackPlayerDataEvents = exports.useTrackPlayerDataEvent = exports.useTrackPlayerEvents = exports.useTrackPlayerEvent = void 0;
var react_1 = require("react");
var trackPlayer_1 = require("./trackPlayer");
var interfaces_1 = require("./interfaces");
function noNull(value) {
    return value === null ? undefined : value;
}
/**
 * Attaches a handler to the given TrackPlayer event and performs cleanup on unmount
 * @param event - TrackPlayer event to subscribe to
 * @param handler - callback invoked when the event fires
 */
function useTrackPlayerEvent(event, handler) {
    var savedHandler = (0, react_1.useRef)();
    (0, react_1.useEffect)(function () {
        savedHandler.current = handler;
    }, [handler]);
    (0, react_1.useEffect)(function () {
        var sub = trackPlayer_1.default.addEventListener(event, function (payload) {
            if (savedHandler === null || savedHandler === void 0 ? void 0 : savedHandler.current) {
                savedHandler.current(__assign(__assign({}, payload), { type: event }));
            }
        });
        return function () { return sub.remove(); };
    }, [event]);
}
exports.useTrackPlayerEvent = useTrackPlayerEvent;
/**
 * Attaches a handler to the given TrackPlayer events and performs cleanup on unmount
 * @param events - TrackPlayer events to subscribe to
 * @param handler - callback invoked when the event fires
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useTrackPlayerEvents(events, handler) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    var savedHandler = (0, react_1.useRef)();
    (0, react_1.useEffect)(function () {
        savedHandler.current = handler;
    }, [handler]);
    (0, react_1.useEffect)(function () {
        var subs = events.map(function (event) {
            return trackPlayer_1.default.addEventListener(event, function (payload) {
                if (savedHandler === null || savedHandler === void 0 ? void 0 : savedHandler.current) {
                    savedHandler.current(__assign(__assign({}, payload), { type: event }));
                }
            });
        });
        return function () { return subs.forEach(function (sub) { return sub.remove(); }); };
    }, [events]);
}
exports.useTrackPlayerEvents = useTrackPlayerEvents;
// , EventMap[Event.PlaybackState]
/**
 * Attaches a handler to the given TrackPlayer event, stores data, updates data (if not equal) and performs cleanup on unmount
 * @param event - TrackPlayer event to subscribe to
 * @param handler - callback invoked when the event fires
 * @param defaultValue - the default value of the data
 * @param compareFunc - optional callback to compare for equal (=== default)
 * @param filter - optional callback to check if should be updated
 */
function useTrackPlayerDataEvent(event, handler, defaultValue, compareFunc, filter) {
    var _a = (0, react_1.useState)(defaultValue), data = _a[0], setData = _a[1];
    var isUnmountedRef = (0, react_1.useRef)(true);
    (0, react_1.useEffect)(function () {
        isUnmountedRef.current = false;
        return function () {
            isUnmountedRef.current = true;
        };
    }, []);
    var refresh = (0, react_1.useCallback)(function (payload) {
        if (filter) {
            if (!filter(payload)) {
                return;
            }
        }
        handler(payload)
            .then(function (value) {
            if (isUnmountedRef.current) {
                return;
            }
            if (compareFunc) {
                if (compareFunc(data, value)) {
                    return;
                }
            }
            else {
                if (data === value) {
                    return;
                }
            }
            setData(value);
        })
            .catch(console.error);
    }, [compareFunc, data, filter, handler]);
    (0, react_1.useEffect)(function () { return refresh(); }, []);
    useTrackPlayerEvent(event, refresh);
    return data;
}
exports.useTrackPlayerDataEvent = useTrackPlayerDataEvent;
/**
 * Attaches a handler to the given TrackPlayer events, stores data, updates data (if not equal) and performs cleanup on unmount
 * @param events - TrackPlayer events to subscribe to
 * @param handler - callback invoked when the event fires
 * @param defaultValue - the default value of the data
 * @param compareFunc - optional callback to compare for equal (=== default)
 */
function useTrackPlayerDataEvents(events, handler, defaultValue, compareFunc) {
    var _a = (0, react_1.useState)(defaultValue), data = _a[0], setData = _a[1];
    var isUnmountedRef = (0, react_1.useRef)(true);
    (0, react_1.useEffect)(function () {
        isUnmountedRef.current = false;
        return function () {
            isUnmountedRef.current = true;
        };
    }, []);
    var refresh = (0, react_1.useCallback)(function (payload) {
        handler(payload)
            .then(function (value) {
            if (isUnmountedRef.current) {
                return;
            }
            if (compareFunc) {
                if (compareFunc(data, value)) {
                    return;
                }
            }
            else {
                if (data === value) {
                    return;
                }
            }
            setData(value);
        })
            .catch(console.error);
    }, [compareFunc, data, handler]);
    (0, react_1.useEffect)(function () { return refresh(); }, []);
    useTrackPlayerEvents(events, refresh);
    return data;
}
exports.useTrackPlayerDataEvents = useTrackPlayerDataEvents;
/** Get current playback state and subsequent updates  */
function useTrackPlayerPlaybackState() {
    var _this = this;
    return useTrackPlayerDataEvent(interfaces_1.Event.PlaybackState, function (payload) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, payload ? payload.state : trackPlayer_1.default.getState()];
    }); }); }, interfaces_1.State.None);
}
exports.useTrackPlayerPlaybackState = useTrackPlayerPlaybackState;
/**
 * Poll for track progress for the given interval (in milliseconds)
 * @param updateInterval - ms interval
 */
function useTrackPlayerProgress(updateInterval) {
    var _this = this;
    var _a = (0, react_1.useState)({ position: 0, duration: 0, buffered: 0 }), state = _a[0], setState = _a[1];
    var playerState = useTrackPlayerPlaybackState();
    var stateRef = (0, react_1.useRef)(state);
    var isUnmountedRef = (0, react_1.useRef)(true);
    (0, react_1.useEffect)(function () {
        isUnmountedRef.current = false;
        return function () {
            isUnmountedRef.current = true;
        };
    }, []);
    var getProgress = function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, position, duration, buffered, newState;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        trackPlayer_1.default.getPosition(),
                        trackPlayer_1.default.getDuration(),
                        trackPlayer_1.default.getBufferedPosition()
                    ])];
                case 1:
                    _a = _b.sent(), position = _a[0], duration = _a[1], buffered = _a[2];
                    // If the component has been unmounted, exit
                    if (isUnmountedRef.current) {
                        return [2 /*return*/];
                    }
                    // If there is no change in properties, exit
                    if (position === stateRef.current.position &&
                        duration === stateRef.current.duration &&
                        buffered === stateRef.current.buffered) {
                        return [2 /*return*/];
                    }
                    newState = { position: position, duration: duration, buffered: buffered };
                    stateRef.current = newState;
                    setState(newState);
                    return [2 /*return*/];
            }
        });
    }); };
    (0, react_1.useEffect)(function () {
        if (isUnmountedRef.current) {
            return;
        }
        if ([interfaces_1.State.None, interfaces_1.State.Stopped].includes(playerState)) {
            setState({ position: 0, duration: 0, buffered: 0 });
            return;
        }
        // Set initial state
        getProgress().catch(console.error);
        // Create interval to update state periodically
        var poll = setInterval(getProgress, updateInterval || 1000);
        return function () { return clearInterval(poll); };
    }, [playerState, updateInterval]);
    return state;
}
exports.useTrackPlayerProgress = useTrackPlayerProgress;
function useTrackPlayerCurrentTrackNr() {
    var _this = this;
    return useTrackPlayerDataEvent(interfaces_1.Event.PlaybackTrackChanged, function (payload) { return __awaiter(_this, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = noNull;
                if (!payload) return [3 /*break*/, 1];
                _b = payload === null || payload === void 0 ? void 0 : payload.nextTrack;
                return [3 /*break*/, 3];
            case 1: return [4 /*yield*/, trackPlayer_1.default.getCurrentTrack()];
            case 2:
                _b = _c.sent();
                _c.label = 3;
            case 3: return [2 /*return*/, _a.apply(void 0, [_b])];
        }
    }); }); }, undefined, function () { return false; } // always update, even if trackNr did not change (the track itself may have changed)
    );
}
exports.useTrackPlayerCurrentTrackNr = useTrackPlayerCurrentTrackNr;
function useTrackPlayerCurrentTrack() {
    var trackNr = useTrackPlayerCurrentTrackNr();
    var _a = (0, react_1.useState)(undefined), track = _a[0], setTrack = _a[1];
    var isUnmountedRef = (0, react_1.useRef)(true);
    (0, react_1.useEffect)(function () {
        isUnmountedRef.current = false;
        return function () {
            isUnmountedRef.current = true;
        };
    }, []);
    var refresh = (0, react_1.useCallback)(function () {
        if (trackNr === undefined) {
            if (isUnmountedRef.current) {
                return;
            }
            setTrack(undefined);
            return;
        }
        if (isUnmountedRef.current) {
            return;
        }
        trackPlayer_1.default.getTrack(trackNr)
            .then(function (value) {
            if (isUnmountedRef.current) {
                return;
            }
            setTrack(noNull(value));
        })
            .catch(console.error);
    }, [trackNr]);
    (0, react_1.useEffect)(function () {
        refresh();
    }, [trackNr]);
    (0, react_1.useEffect)(function () {
        refresh();
    }, []);
    return track;
}
exports.useTrackPlayerCurrentTrack = useTrackPlayerCurrentTrack;
function useTrackPlayerQueue() {
    var _a = (0, react_1.useState)(), queue = _a[0], setQueueState = _a[1];
    var isUnmountedRef = (0, react_1.useRef)(true);
    (0, react_1.useEffect)(function () {
        isUnmountedRef.current = false;
        return function () {
            isUnmountedRef.current = true;
        };
    }, []);
    var refresh = function () {
        trackPlayer_1.default.getQueue()
            .then(function (value) {
            if (isUnmountedRef.current) {
                return;
            }
            setQueueState(value);
        })
            .catch(console.error);
    };
    (0, react_1.useEffect)(function () { return refresh(); }, []);
    useTrackPlayerEvent(interfaces_1.Event.QueueChanged, refresh);
    return queue;
}
exports.useTrackPlayerQueue = useTrackPlayerQueue;
function useTrackPlayerDownloads() {
    var _this = this;
    return useTrackPlayerDataEvent(interfaces_1.Event.DownloadsChanged, function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, trackPlayer_1.default.getDownloads()];
    }); }); }, undefined);
}
exports.useTrackPlayerDownloads = useTrackPlayerDownloads;
function useTrackPlayerDownloadsPaused() {
    var _this = this;
    return useTrackPlayerDataEvent(interfaces_1.Event.DownloadsPausedChanged, function (payload) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, payload ? payload.paused : trackPlayer_1.default.getDownloadsPaused()];
    }); }); }, false);
}
exports.useTrackPlayerDownloadsPaused = useTrackPlayerDownloadsPaused;
function useTrackPlayerCurrentDownloads() {
    var _this = this;
    return useTrackPlayerDataEvent(interfaces_1.Event.DownloadsChanged, function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, trackPlayer_1.default.getCurrentDownloads()];
    }); }); }, undefined);
}
exports.useTrackPlayerCurrentDownloads = useTrackPlayerCurrentDownloads;
function useTrackPlayerDownload(id) {
    var _this = this;
    return useTrackPlayerDataEvent(interfaces_1.Event.DownloadChanged, function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, trackPlayer_1.default.getDownload(id)];
    }); }); }, undefined, function () { return false; }, // always update
    function (payload) { return (payload === null || payload === void 0 ? void 0 : payload.id) === id; });
}
exports.useTrackPlayerDownload = useTrackPlayerDownload;
function useTrackPlayerPlaybackStateIs() {
    var states = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        states[_i] = arguments[_i];
    }
    var state = useTrackPlayerPlaybackState();
    return states.includes(state);
}
exports.useTrackPlayerPlaybackStateIs = useTrackPlayerPlaybackStateIs;
function useTrackPlayerPlaybackStateIsPlaying() {
    var state = useTrackPlayerPlaybackState();
    return state === interfaces_1.State.Playing;
}
exports.useTrackPlayerPlaybackStateIsPlaying = useTrackPlayerPlaybackStateIsPlaying;
function useTrackPlayerProgressPercent(interval) {
    if (interval === void 0) { interval = 1000; }
    var _a = (0, react_1.useState)({
        progress: 0,
        bufferProgress: 0
    }), percent = _a[0], setPercent = _a[1];
    var progress = useTrackPlayerProgress(interval);
    var isUnmountedRef = (0, react_1.useRef)(true);
    (0, react_1.useEffect)(function () {
        isUnmountedRef.current = false;
        return function () {
            isUnmountedRef.current = true;
        };
    }, []);
    (0, react_1.useEffect)(function () {
        if (isUnmountedRef.current) {
            return;
        }
        var position = progress.position, buffered = progress.buffered, duration = progress.duration;
        setPercent({
            progress: duration ? position / duration : 0,
            bufferProgress: duration ? buffered / duration : 0
        });
    }, [progress]);
    return percent;
}
exports.useTrackPlayerProgressPercent = useTrackPlayerProgressPercent;
function useTrackPlayerProgressMS(interval) {
    if (interval === void 0) { interval = 1000; }
    var _a = (0, react_1.useState)({
        duration: 0,
        position: 0
    }), ms = _a[0], setMs = _a[1];
    var progress = useTrackPlayerProgress(interval);
    var isUnmountedRef = (0, react_1.useRef)(true);
    (0, react_1.useEffect)(function () {
        isUnmountedRef.current = false;
        return function () {
            isUnmountedRef.current = true;
        };
    }, []);
    (0, react_1.useEffect)(function () {
        if (isUnmountedRef.current) {
            return;
        }
        var duration = progress.duration, position = progress.position;
        setMs({
            duration: duration * 1000,
            position: position * 1000
        });
    }, [progress]);
    return ms;
}
exports.useTrackPlayerProgressMS = useTrackPlayerProgressMS;
function useTrackPlayerShuffleModeEnabled() {
    var _this = this;
    return useTrackPlayerDataEvent(interfaces_1.Event.ShuffleModeChanged, function (payload) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, payload ? payload.enabled : trackPlayer_1.default.getShuffleModeEnabled()];
    }); }); }, false);
}
exports.useTrackPlayerShuffleModeEnabled = useTrackPlayerShuffleModeEnabled;
function useTrackPlayerRepeatMode() {
    var _this = this;
    return useTrackPlayerDataEvent(interfaces_1.Event.RepeatModeChanged, function (payload) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, payload ? payload.mode : trackPlayer_1.default.getRepeatMode()];
    }); }); }, interfaces_1.RepeatMode.Off);
}
exports.useTrackPlayerRepeatMode = useTrackPlayerRepeatMode;
function useTrackPlayerPlaybackParameters() {
    var _this = this;
    return useTrackPlayerDataEvent(interfaces_1.Event.PlaybackParametersChanged, function (payload) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, payload ? payload : trackPlayer_1.default.getPlaybackParameters()];
    }); }); }, { speed: 1, pitch: 1 });
}
exports.useTrackPlayerPlaybackParameters = useTrackPlayerPlaybackParameters;
function useTrackPlayerPlaybackSpeed() {
    var params = useTrackPlayerPlaybackParameters();
    return params.speed;
}
exports.useTrackPlayerPlaybackSpeed = useTrackPlayerPlaybackSpeed;
function useTrackPlayerPlaybackPitch() {
    var params = useTrackPlayerPlaybackParameters();
    return params.pitch;
}
exports.useTrackPlayerPlaybackPitch = useTrackPlayerPlaybackPitch;
function useTrackPlayerHasNext() {
    var _this = this;
    return useTrackPlayerDataEvents([interfaces_1.Event.PlaybackTrackChanged, interfaces_1.Event.ShuffleModeChanged, interfaces_1.Event.QueueChanged], function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, trackPlayer_1.default.hasNext()];
    }); }); }, false);
}
exports.useTrackPlayerHasNext = useTrackPlayerHasNext;
function useTrackPlayerHasPrevious() {
    var _this = this;
    return useTrackPlayerDataEvents([interfaces_1.Event.PlaybackTrackChanged, interfaces_1.Event.ShuffleModeChanged, interfaces_1.Event.QueueChanged], function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, trackPlayer_1.default.hasPrevious()];
    }); }); }, false);
}
exports.useTrackPlayerHasPrevious = useTrackPlayerHasPrevious;
function useTrackPlayerHasSiblings() {
    var _this = this;
    return useTrackPlayerDataEvents([interfaces_1.Event.PlaybackTrackChanged, interfaces_1.Event.ShuffleModeChanged, interfaces_1.Event.QueueChanged], function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = {};
                    return [4 /*yield*/, trackPlayer_1.default.hasNext()];
                case 1:
                    _a.hasNext = _b.sent();
                    return [4 /*yield*/, trackPlayer_1.default.hasPrevious()];
                case 2: return [2 /*return*/, (_a.hasPrevious = _b.sent(),
                        _a)];
            }
        });
    }); }, { hasNext: false, hasPrevious: false }, function (prev, next) {
        return prev.hasNext === next.hasNext && prev.hasPrevious === next.hasPrevious;
    });
}
exports.useTrackPlayerHasSiblings = useTrackPlayerHasSiblings;
