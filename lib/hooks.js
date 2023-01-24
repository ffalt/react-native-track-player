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
exports.useTrackPlayerHasSiblings = exports.useTrackPlayerHasPrevious = exports.useTrackPlayerHasNext = exports.useTrackPlayerPlaybackPitch = exports.useTrackPlayerPlaybackSpeed = exports.useTrackPlayerPlaybackParameters = exports.useTrackPlayerRepeatMode = exports.useTrackPlayerShuffleModeEnabled = exports.useTrackPlayerProgressMS = exports.useTrackPlayerProgressPercent = exports.useTrackPlayerPlaybackStateIsPlaying = exports.useTrackPlayerPlaybackStateIs = exports.useTrackPlayerDownload = exports.useTrackPlayerCurrentDownloads = exports.useTrackPlayerDownloadsPaused = exports.useTrackPlayerDownloads = exports.useTrackPlayerQueue = exports.useTrackPlayerCurrentTrack = exports.useTrackPlayerCurrentTrackNr = exports.useTrackPlayerProgress = exports.useTrackPlayerEvent = exports.useTrackPlayerEvents = exports.useTrackPlayerPlaybackState = void 0;
var react_1 = require("react");
var trackPlayer_1 = require("./trackPlayer");
var interfaces_1 = require("./interfaces");
/** Get current playback state and subsequent updatates  */
var useTrackPlayerPlaybackState = function () {
    var _a = (0, react_1.useState)(interfaces_1.State.None), state = _a[0], setState = _a[1];
    var isUnmountedRef = (0, react_1.useRef)(true);
    (0, react_1.useEffect)(function () {
        isUnmountedRef.current = false;
        return function () {
            isUnmountedRef.current = true;
        };
    }, [trackPlayer_1.default]);
    (0, react_1.useEffect)(function () {
        function setPlayerState() {
            return __awaiter(this, void 0, void 0, function () {
                var playerState;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, trackPlayer_1.default.getState()];
                        case 1:
                            playerState = _a.sent();
                            // If the component has been unmounted, exit
                            if (isUnmountedRef.current)
                                return [2 /*return*/];
                            setState(playerState);
                            return [2 /*return*/];
                    }
                });
            });
        }
        // Set initial state
        setPlayerState();
        var sub = trackPlayer_1.default.addEventListener(interfaces_1.Event.PlaybackState, function (data) {
            setState(data.state);
        });
        return function () { return sub.remove(); };
    }, []);
    return state;
};
exports.useTrackPlayerPlaybackState = useTrackPlayerPlaybackState;
/**
 * Attaches a handler to the given TrackPlayer events and performs cleanup on unmount
 * @param events - TrackPlayer events to subscribe to
 * @param handler - callback invoked when the event fires
 */
var useTrackPlayerEvents = function (events, handler) {
    var savedHandler = (0, react_1.useRef)();
    (0, react_1.useEffect)(function () {
        savedHandler.current = handler;
    }, [handler]);
    (0, react_1.useEffect)(function () {
        var subs = events.map(function (event) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return trackPlayer_1.default.addEventListener(event, function (payload) { return savedHandler.current(__assign(__assign({}, payload), { type: event })); });
        });
        return function () { return subs.forEach(function (sub) { return sub.remove(); }); };
    }, [events]);
};
exports.useTrackPlayerEvents = useTrackPlayerEvents;
var useTrackPlayerEvent = function (event, handler) {
    var savedHandler = (0, react_1.useRef)();
    (0, react_1.useEffect)(function () {
        savedHandler.current = handler;
    }, [handler]);
    (0, react_1.useEffect)(function () {
        var sub = trackPlayer_1.default.addEventListener(event, function (payload) { return savedHandler.current(__assign(__assign({}, payload), { type: event })); });
        return function () { return sub.remove(); };
    }, [event]);
};
exports.useTrackPlayerEvent = useTrackPlayerEvent;
/**
 * Poll for track progress for the given interval (in miliseconds)
 * @param interval - ms interval
 */
function useTrackPlayerProgress(updateInterval) {
    var _this = this;
    var _a = (0, react_1.useState)({ position: 0, duration: 0, buffered: 0 }), state = _a[0], setState = _a[1];
    var playerState = (0, exports.useTrackPlayerPlaybackState)();
    var stateRef = (0, react_1.useRef)(state);
    var isUnmountedRef = (0, react_1.useRef)(true);
    (0, react_1.useEffect)(function () {
        isUnmountedRef.current = false;
        return function () {
            isUnmountedRef.current = true;
        };
    }, []);
    var getProgress = function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, position, duration, buffered, state;
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
                    if (isUnmountedRef.current)
                        return [2 /*return*/];
                    // If there is no change in properties, exit
                    if (position === stateRef.current.position &&
                        duration === stateRef.current.duration &&
                        buffered === stateRef.current.buffered)
                        return [2 /*return*/];
                    state = { position: position, duration: duration, buffered: buffered };
                    stateRef.current = state;
                    setState(state);
                    return [2 /*return*/];
            }
        });
    }); };
    (0, react_1.useEffect)(function () {
        if (playerState === interfaces_1.State.None) {
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
function noNull(value) {
    return value === null ? undefined : value;
}
function useTrackPlayerCurrentTrackNr() {
    var _a = (0, react_1.useState)(undefined), trackNr = _a[0], setTrackNr = _a[1];
    var isUnmountedRef = (0, react_1.useRef)(true);
    (0, react_1.useEffect)(function () {
        isUnmountedRef.current = false;
        return function () {
            isUnmountedRef.current = true;
        };
    }, []);
    (0, exports.useTrackPlayerEvent)(interfaces_1.Event.PlaybackTrackChanged, function (event) {
        var nextNr = noNull(event.nextTrack);
        if (trackNr !== nextNr) {
            setTrackNr(nextNr);
        }
    });
    (0, react_1.useEffect)(function () {
        trackPlayer_1.default.getCurrentTrack().then(function (tnr) {
            if (isUnmountedRef.current)
                return;
            setTrackNr(noNull(tnr));
        });
    }, [trackNr]);
    return trackNr;
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
    (0, react_1.useEffect)(function () {
        if (trackNr === undefined) {
            if (isUnmountedRef.current)
                return;
            setTrack(undefined);
        }
        else {
            trackPlayer_1.default.getTrack(trackNr).then(function (t) {
                if (isUnmountedRef.current)
                    return;
                setTrack(noNull(t));
            });
        }
    }, [trackNr]);
    return track;
}
exports.useTrackPlayerCurrentTrack = useTrackPlayerCurrentTrack;
function useTrackPlayerQueue() {
    var _this = this;
    var _a = (0, react_1.useState)(), queue = _a[0], setQueueState = _a[1];
    (0, react_1.useEffect)(function () {
        var didCancel = false;
        var fetchQueue = function () { return __awaiter(_this, void 0, void 0, function () {
            var fetched;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, trackPlayer_1.default.getQueue()];
                    case 1:
                        fetched = _a.sent();
                        if (!didCancel) {
                            setQueueState(fetched);
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        fetchQueue().catch(console.error);
        return function () {
            didCancel = true;
        };
    }, []);
    (0, exports.useTrackPlayerEvent)(interfaces_1.Event.QueueChanged, function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = setQueueState;
                    return [4 /*yield*/, trackPlayer_1.default.getQueue()];
                case 1:
                    _a.apply(void 0, [_b.sent()]);
                    return [2 /*return*/];
            }
        });
    }); });
    return queue;
}
exports.useTrackPlayerQueue = useTrackPlayerQueue;
function useTrackPlayerDownloads() {
    var _this = this;
    var _a = (0, react_1.useState)(), downloads = _a[0], setDownloads = _a[1];
    (0, react_1.useEffect)(function () {
        var didCancel = false;
        var fetchDownloads = function () { return __awaiter(_this, void 0, void 0, function () {
            var fetched;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, trackPlayer_1.default.getDownloads()];
                    case 1:
                        fetched = _a.sent();
                        if (!didCancel) {
                            setDownloads(fetched);
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        fetchDownloads().catch(console.error);
        return function () {
            didCancel = true;
        };
    }, []);
    (0, exports.useTrackPlayerEvent)(interfaces_1.Event.DownloadsChanged, function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = setDownloads;
                    return [4 /*yield*/, trackPlayer_1.default.getDownloads()];
                case 1:
                    _a.apply(void 0, [_b.sent()]);
                    return [2 /*return*/];
            }
        });
    }); });
    return downloads;
}
exports.useTrackPlayerDownloads = useTrackPlayerDownloads;
function useTrackPlayerDownloadsPaused() {
    var _this = this;
    var _a = (0, react_1.useState)(false), paused = _a[0], setPaused = _a[1];
    (0, react_1.useEffect)(function () {
        var didCancel = false;
        var fetchpaused = function () { return __awaiter(_this, void 0, void 0, function () {
            var fetched;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, trackPlayer_1.default.getDownloadsPaused()];
                    case 1:
                        fetched = _a.sent();
                        if (!didCancel) {
                            setPaused(fetched);
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        fetchpaused().catch(console.error);
        return function () {
            didCancel = true;
        };
    }, []);
    (0, exports.useTrackPlayerEvent)(interfaces_1.Event.DownloadsPausedChanged, function (event) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            setPaused(event.paused);
            return [2 /*return*/];
        });
    }); });
    return paused;
}
exports.useTrackPlayerDownloadsPaused = useTrackPlayerDownloadsPaused;
function useTrackPlayerCurrentDownloads() {
    var _this = this;
    var _a = (0, react_1.useState)(), downloads = _a[0], setDownloads = _a[1];
    (0, react_1.useEffect)(function () {
        var didCancel = false;
        var fetchDownloads = function () { return __awaiter(_this, void 0, void 0, function () {
            var fetched;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, trackPlayer_1.default.getCurrentDownloads()];
                    case 1:
                        fetched = _a.sent();
                        if (!didCancel) {
                            setDownloads(fetched);
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        fetchDownloads().catch(console.error);
        return function () {
            didCancel = true;
        };
    }, []);
    (0, exports.useTrackPlayerEvent)(interfaces_1.Event.DownloadsChanged, function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = setDownloads;
                    return [4 /*yield*/, trackPlayer_1.default.getCurrentDownloads()];
                case 1:
                    _a.apply(void 0, [_b.sent()]);
                    return [2 /*return*/];
            }
        });
    }); });
    return downloads;
}
exports.useTrackPlayerCurrentDownloads = useTrackPlayerCurrentDownloads;
function useTrackPlayerDownload(id) {
    var _this = this;
    var _a = (0, react_1.useState)(), download = _a[0], setDownload = _a[1];
    (0, react_1.useEffect)(function () {
        var didCancel = false;
        var fetchDownloads = function () { return __awaiter(_this, void 0, void 0, function () {
            var fetched;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, trackPlayer_1.default.getDownload(id)];
                    case 1:
                        fetched = _a.sent();
                        if (!didCancel) {
                            setDownload(fetched);
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        fetchDownloads().catch(console.error);
        return function () {
            didCancel = true;
        };
    }, []);
    (0, exports.useTrackPlayerEvent)(interfaces_1.Event.DownloadChanged, function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = setDownload;
                    return [4 /*yield*/, trackPlayer_1.default.getDownload(id)];
                case 1:
                    _a.apply(void 0, [_b.sent()]);
                    return [2 /*return*/];
            }
        });
    }); });
    return download;
}
exports.useTrackPlayerDownload = useTrackPlayerDownload;
function useTrackPlayerWhenPlaybackStateChanges(callback) {
    (0, exports.useTrackPlayerEvent)(interfaces_1.Event.PlaybackState, function (event) { return callback(event.state); });
    (0, react_1.useEffect)(function () {
        var didCancel = false;
        function fetchPlaybackState() {
            return __awaiter(this, void 0, void 0, function () {
                var playbackState;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, trackPlayer_1.default.getState()];
                        case 1:
                            playbackState = _a.sent();
                            if (!didCancel) {
                                callback(playbackState);
                            }
                            return [2 /*return*/];
                    }
                });
            });
        }
        fetchPlaybackState().catch(console.error);
        return function () {
            didCancel = true;
        };
    }, [callback]);
}
// export function useTrackPlayerPlaybackState(): State | undefined {
//   const [playbackState, setPlaybackState] = useState<State | undefined>();
//   useWhenPlaybackStateChanges(setPlaybackState);
//   return playbackState;
// }
var useTrackPlayerPlaybackStateIs = function () {
    var states = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        states[_i] = arguments[_i];
    }
    var _a = (0, react_1.useState)(false), is = _a[0], setIs = _a[1];
    useTrackPlayerWhenPlaybackStateChanges(function (state) {
        setIs(states.includes(state));
    });
    return is;
};
exports.useTrackPlayerPlaybackStateIs = useTrackPlayerPlaybackStateIs;
var useTrackPlayerPlaybackStateIsPlaying = function () {
    var _a = (0, react_1.useState)(false), is = _a[0], setIs = _a[1];
    useTrackPlayerWhenPlaybackStateChanges(function (state) {
        setIs(state === interfaces_1.State.Playing);
    });
    return is;
};
exports.useTrackPlayerPlaybackStateIsPlaying = useTrackPlayerPlaybackStateIsPlaying;
var useTrackPlayerProgressPercent = function (interval) {
    if (interval === void 0) { interval = 1000; }
    var _a = (0, react_1.useState)({
        progress: 0,
        bufferProgress: 0
    }), percent = _a[0], setPercent = _a[1];
    var _b = useTrackPlayerProgress(interval), position = _b.position, buffered = _b.buffered, duration = _b.duration;
    useTrackPlayerWhenPlaybackStateChanges(function (state) {
        if (state === interfaces_1.State.Stopped) {
            setPercent({ progress: 0, bufferProgress: 0 });
        }
    });
    (0, react_1.useEffect)(function () {
        var progress = duration ? position / duration : 0;
        var bufferProgress = duration ? buffered / duration : 0;
        setPercent({ progress: progress, bufferProgress: bufferProgress });
    }, [position, buffered, duration]);
    return percent;
};
exports.useTrackPlayerProgressPercent = useTrackPlayerProgressPercent;
var useTrackPlayerProgressMS = function () {
    var _a = (0, react_1.useState)({ duration: 0, position: 0 }), now = _a[0], setNow = _a[1];
    var _b = useTrackPlayerProgress(), duration = _b.duration, position = _b.position;
    useTrackPlayerWhenPlaybackStateChanges(function (state) {
        if (state === interfaces_1.State.Stopped) {
            setNow({ duration: 0, position: 0 });
        }
    });
    (0, react_1.useEffect)(function () {
        var isSubscribed = true;
        function fetchData() {
            return __awaiter(this, void 0, void 0, function () {
                var d, p;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, trackPlayer_1.default.getDuration()];
                        case 1:
                            d = _a.sent();
                            return [4 /*yield*/, trackPlayer_1.default.getPosition()];
                        case 2:
                            p = _a.sent();
                            if (isSubscribed) {
                                setNow({ duration: d * 1000, position: p * 1000 });
                            }
                            return [2 /*return*/];
                    }
                });
            });
        }
        fetchData();
        return function () {
            isSubscribed = false;
        };
    }, []);
    (0, react_1.useEffect)(function () {
        setNow({ duration: duration * 1000, position: position * 1000 });
    }, [duration, position]);
    return now;
};
exports.useTrackPlayerProgressMS = useTrackPlayerProgressMS;
var useTrackPlayerShuffleModeEnabled = function () {
    var _a = (0, react_1.useState)(false), is = _a[0], setIs = _a[1];
    (0, exports.useTrackPlayerEvent)(interfaces_1.Event.ShuffleModeChanged, function (event) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            setIs(event.enabled);
            return [2 /*return*/];
        });
    }); });
    (0, react_1.useEffect)(function () {
        var isSubscribed = true;
        trackPlayer_1.default.getShuffleModeEnabled().then(function (value) {
            if (isSubscribed) {
                setIs(value);
            }
        });
        return function () {
            isSubscribed = false;
        };
    }, []);
    return is;
};
exports.useTrackPlayerShuffleModeEnabled = useTrackPlayerShuffleModeEnabled;
var useTrackPlayerRepeatMode = function () {
    var _a = (0, react_1.useState)(interfaces_1.RepeatMode.Off), mode = _a[0], setMode = _a[1];
    (0, exports.useTrackPlayerEvent)(interfaces_1.Event.RepeatModeChanged, function (event) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            setMode(event.mode);
            return [2 /*return*/];
        });
    }); });
    (0, react_1.useEffect)(function () {
        var isSubscribed = true;
        trackPlayer_1.default.getRepeatMode().then(function (value) {
            if (isSubscribed) {
                setMode(value);
            }
        });
        return function () {
            isSubscribed = false;
        };
    }, []);
    return mode;
};
exports.useTrackPlayerRepeatMode = useTrackPlayerRepeatMode;
var useTrackPlayerPlaybackParameters = function () {
    var _a = (0, react_1.useState)({ speed: 1, pitch: 1 }), params = _a[0], setParams = _a[1];
    (0, exports.useTrackPlayerEvent)(interfaces_1.Event.PlaybackParametersChanged, function (event) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            setParams({ speed: event.speed, pitch: event.pitch });
            return [2 /*return*/];
        });
    }); });
    (0, react_1.useEffect)(function () {
        var isSubscribed = true;
        trackPlayer_1.default.getPlaybackParameters().then(function (value) {
            if (isSubscribed) {
                setParams({ speed: value.speed, pitch: value.pitch });
            }
        });
        return function () {
            isSubscribed = false;
        };
    }, []);
    return params;
};
exports.useTrackPlayerPlaybackParameters = useTrackPlayerPlaybackParameters;
var useTrackPlayerPlaybackSpeed = function () {
    var _a = (0, react_1.useState)(1), speed = _a[0], setSpeed = _a[1];
    (0, exports.useTrackPlayerEvent)(interfaces_1.Event.PlaybackParametersChanged, function (event) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            setSpeed(event.speed);
            return [2 /*return*/];
        });
    }); });
    (0, react_1.useEffect)(function () {
        var isSubscribed = true;
        trackPlayer_1.default.getPlaybackSpeed().then(function (value) {
            if (isSubscribed) {
                setSpeed(value);
            }
        });
        return function () {
            isSubscribed = false;
        };
    }, []);
    return speed;
};
exports.useTrackPlayerPlaybackSpeed = useTrackPlayerPlaybackSpeed;
var useTrackPlayerPlaybackPitch = function () {
    var _a = (0, react_1.useState)(1), pitch = _a[0], setPitch = _a[1];
    (0, exports.useTrackPlayerEvent)(interfaces_1.Event.PlaybackParametersChanged, function (event) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            setPitch(event.pitch);
            return [2 /*return*/];
        });
    }); });
    (0, react_1.useEffect)(function () {
        var isSubscribed = true;
        trackPlayer_1.default.getPlaybackPitch().then(function (value) {
            if (isSubscribed) {
                setPitch(value);
            }
        });
        return function () {
            isSubscribed = false;
        };
    }, []);
    return pitch;
};
exports.useTrackPlayerPlaybackPitch = useTrackPlayerPlaybackPitch;
var useTrackPlayerHasNext = function () {
    var _a = (0, react_1.useState)(false), has = _a[0], setHas = _a[1];
    (0, exports.useTrackPlayerEvents)([interfaces_1.Event.PlaybackTrackChanged, interfaces_1.Event.ShuffleModeChanged, interfaces_1.Event.QueueChanged], function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = setHas;
                    return [4 /*yield*/, trackPlayer_1.default.hasNext()];
                case 1:
                    _a.apply(void 0, [_b.sent()]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, react_1.useEffect)(function () {
        var isSubscribed = true;
        trackPlayer_1.default.hasNext().then(function (value) {
            if (isSubscribed) {
                setHas(value);
            }
        });
        return function () {
            isSubscribed = false;
        };
    }, []);
    return has;
};
exports.useTrackPlayerHasNext = useTrackPlayerHasNext;
var useTrackPlayerHasPrevious = function () {
    var _a = (0, react_1.useState)(false), has = _a[0], setHas = _a[1];
    (0, exports.useTrackPlayerEvents)([interfaces_1.Event.PlaybackTrackChanged, interfaces_1.Event.ShuffleModeChanged, interfaces_1.Event.QueueChanged], function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = setHas;
                    return [4 /*yield*/, trackPlayer_1.default.hasPrevious()];
                case 1:
                    _a.apply(void 0, [_b.sent()]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, react_1.useEffect)(function () {
        var isSubscribed = true;
        trackPlayer_1.default.hasPrevious().then(function (value) {
            if (isSubscribed) {
                setHas(value);
            }
        });
        return function () {
            isSubscribed = false;
        };
    }, []);
    return has;
};
exports.useTrackPlayerHasPrevious = useTrackPlayerHasPrevious;
var useTrackPlayerHasSiblings = function () {
    var _a = (0, react_1.useState)({ hasNext: false, hasPrevious: false }), siblings = _a[0], setSiblings = _a[1];
    var update = function () { return __awaiter(void 0, void 0, void 0, function () {
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
    }); };
    (0, exports.useTrackPlayerEvents)([interfaces_1.Event.PlaybackTrackChanged, interfaces_1.Event.ShuffleModeChanged, interfaces_1.Event.QueueChanged], function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = setSiblings;
                    return [4 /*yield*/, update()];
                case 1:
                    _a.apply(void 0, [_b.sent()]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, react_1.useEffect)(function () {
        var isSubscribed = true;
        update().then(function (value) {
            if (isSubscribed) {
                setSiblings(value);
            }
        });
        return function () {
            isSubscribed = false;
        };
    }, []);
    return siblings;
};
exports.useTrackPlayerHasSiblings = useTrackPlayerHasSiblings;
