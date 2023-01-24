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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_native_1 = require("react-native");
// @ts-ignore
var resolveAssetSource = require("react-native/Libraries/Image/resolveAssetSource");
var TrackPlayer = react_native_1.NativeModules.TrackPlayerModule;
var emitter = react_native_1.Platform.OS !== "android" ? new react_native_1.NativeEventEmitter(TrackPlayer) : react_native_1.DeviceEventEmitter;
// MARK: - Helpers
function resolveImportedPath(path) {
    if (!path)
        return undefined;
    return resolveAssetSource(path) || path;
}
// MARK: - General API
/**
 * Initializes the player with the specified options.
 */
function setupPlayer(options) {
    if (options === void 0) { options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, TrackPlayer.setupPlayer(options || {})];
        });
    });
}
/**
 * Destroys the player, cleaning up its resources.
 */
function destroy() {
    return TrackPlayer.destroy();
}
/**
 * Register the playback service. The service will run as long as the player runs.
 */
function registerPlaybackService(factory) {
    if (react_native_1.Platform.OS === "android") {
        // Registers the headless task
        react_native_1.AppRegistry.registerHeadlessTask("TrackPlayer", factory);
    }
    else {
        // Initializes and runs the service in the next tick
        setImmediate(factory());
    }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function addEventListener(event, listener) {
    return emitter.addListener(event, listener);
}
function isServiceRunning() {
    return TrackPlayer.isServiceRunning();
}
// MARK: - Queue API
/**
 * Adds one or more tracks to the queue.
 */
function add(tracks, insertBeforeIndex) {
    return __awaiter(this, void 0, void 0, function () {
        var i;
        return __generator(this, function (_a) {
            // Clone the array before modifying it
            if (Array.isArray(tracks)) {
                tracks = __spreadArray([], tracks, true);
            }
            else {
                tracks = [tracks];
            }
            if (tracks.length < 1)
                return [2 /*return*/];
            for (i = 0; i < tracks.length; i++) {
                // Clone the object before modifying it
                tracks[i] = __assign({}, tracks[i]);
                // Resolve the URLs
                tracks[i].url = resolveImportedPath(tracks[i].url);
                tracks[i].artwork = resolveImportedPath(tracks[i].artwork);
            }
            // Note: we must be careful about passing nulls to non nullable parameters on Android.
            return [2 /*return*/, TrackPlayer.add(tracks, insertBeforeIndex === undefined ? -1 : insertBeforeIndex)];
        });
    });
}
/**
 * Removes one or more tracks from the queue.
 */
function remove(tracks) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!Array.isArray(tracks)) {
                tracks = [tracks];
            }
            return [2 /*return*/, TrackPlayer.remove(tracks)];
        });
    });
}
/**
 * Clears any upcoming tracks from the queue.
 */
function removeUpcomingTracks() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, TrackPlayer.removeUpcomingTracks()];
        });
    });
}
/**
 * Skips to a track in the queue.
 */
function skip(trackIndex) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, TrackPlayer.skip(trackIndex)];
        });
    });
}
/**
 * Skips to the next track in the queue.
 */
function skipToNext() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, TrackPlayer.skipToNext()];
        });
    });
}
/**
 * Skips to the previous track in the queue.
 */
function skipToPrevious() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, TrackPlayer.skipToPrevious()];
        });
    });
}
// MARK: - Control Center / Notifications API
/**
 * Updates the configuration for the components.
 */
function updateOptions(options) {
    if (options === void 0) { options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            options = __assign({}, options);
            // Resolve the asset for each icon
            options.icon = resolveImportedPath(options.icon);
            options.playIcon = resolveImportedPath(options.playIcon);
            options.pauseIcon = resolveImportedPath(options.pauseIcon);
            options.stopIcon = resolveImportedPath(options.stopIcon);
            options.previousIcon = resolveImportedPath(options.previousIcon);
            options.nextIcon = resolveImportedPath(options.nextIcon);
            options.rewindIcon = resolveImportedPath(options.rewindIcon);
            options.forwardIcon = resolveImportedPath(options.forwardIcon);
            return [2 /*return*/, TrackPlayer.updateOptions(options)];
        });
    });
}
/**
 * Updates the metadata of a track in the queue. If the current track is updated,
 * the notification and the Now Playing Center will be updated accordingly.
 */
function updateMetadataForTrack(trackIndex, metadata) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // Clone the object before modifying it
            metadata = Object.assign({}, metadata);
            // Resolve the artwork URL
            metadata.artwork = resolveImportedPath(metadata.artwork);
            return [2 /*return*/, TrackPlayer.updateMetadataForTrack(trackIndex, metadata)];
        });
    });
}
function clearNowPlayingMetadata() {
    return TrackPlayer.clearNowPlayingMetadata();
}
function updateNowPlayingMetadata(metadata) {
    // Clone the object before modifying it
    metadata = Object.assign({}, metadata);
    // Resolve the artwork URL
    metadata.artwork = resolveImportedPath(metadata.artwork);
    return TrackPlayer.updateNowPlayingMetadata(metadata);
}
// MARK: - Player API
/**
 * Resets the player stopping the current track and clearing the queue.
 */
function reset() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, TrackPlayer.reset()];
        });
    });
}
/**
 * Plays or resumes the current track.
 */
function play() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, TrackPlayer.play()];
        });
    });
}
/**
 * Pauses the current track.
 */
function pause() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, TrackPlayer.pause()];
        });
    });
}
/**
 * Stops the current track.
 */
function stop() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, TrackPlayer.stop()];
        });
    });
}
/**
 * Seeks to a specified time position in the current track.
 */
function seekTo(position) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, TrackPlayer.seekTo(position)];
        });
    });
}
/**
 * Sets the volume of the player.
 */
function setVolume(level) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, TrackPlayer.setVolume(level)];
        });
    });
}
/**
 * Sets the repeat mode.
 */
function setRepeatMode(mode) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, TrackPlayer.setRepeatMode(mode)];
        });
    });
}
// MARK: - Getters
/**
 * Gets the volume of the player (a number between 0 and 1).
 */
function getVolume() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, TrackPlayer.getVolume()];
        });
    });
}
/**
 * Gets a track object from the queue.
 */
function getTrack(trackIndex) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, TrackPlayer.getTrack(trackIndex)];
        });
    });
}
/**
 * Gets the whole queue.
 */
function getQueue() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, TrackPlayer.getQueue()];
        });
    });
}
/**
 * Gets the index of the current track.
 */
function getCurrentTrack() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, TrackPlayer.getCurrentTrack()];
        });
    });
}
/**
 * Gets the duration of the current track in seconds.
 */
function getDuration() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, TrackPlayer.getDuration()];
        });
    });
}
/**
 * Gets the buffered position of the player in seconds.
 */
function getBufferedPosition() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, TrackPlayer.getBufferedPosition()];
        });
    });
}
/**
 * Gets the position of the player in seconds.
 */
function getPosition() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, TrackPlayer.getPosition()];
        });
    });
}
/**
 * Gets the state of the player.
 */
function getState() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, TrackPlayer.getState()];
        });
    });
}
/**
 * Gets the repeat mode.
 */
function getRepeatMode() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, TrackPlayer.getRepeatMode()];
        });
    });
}
/**
 * Moves an item in the queue.
 */
function move(index, newIndex) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, TrackPlayer.move(index, newIndex)];
        });
    });
}
/**
 * Shuffle the queue.
 */
function shuffle() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, TrackPlayer.shuffle()];
        });
    });
}
/**
 * Clear the queue.
 */
function clear() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, TrackPlayer.clear()];
        });
    });
}
/**
 * Gets the shuffle mode.
 */
function getShuffleModeEnabled() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, TrackPlayer.getShuffleModeEnabled()];
        });
    });
}
/**
 * Sets the shuffle mode.
 */
function setShuffleModeEnabled(enabled) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, TrackPlayer.setShuffleModeEnabled(enabled)];
        });
    });
}
/**
 * Adds download requests.
 */
function addDownloads(requests) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, TrackPlayer.addDownloads(requests)];
        });
    });
}
/**
 * Remove all downloads.
 */
function clearDownloads() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, TrackPlayer.clearDownloads()];
        });
    });
}
/**
 * Gets all downloads.
 */
function getDownloadsPaused() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, TrackPlayer.getDownloadsPaused()];
        });
    });
}
/**
 * Gets all downloads.
 */
function getDownloads() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, TrackPlayer.getDownloads()];
        });
    });
}
/**
 * Gets all current downloads.
 */
function getCurrentDownloads() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, TrackPlayer.getCurrentDownloads()];
        });
    });
}
/**
 * Set the request headers.
 */
function setDownloadHeaders(header) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, TrackPlayer.setDownloadHeaders(header)];
        });
    });
}
/**
 * Gets an download by id.
 */
function getDownload(id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, TrackPlayer.getDownload(id)];
        });
    });
}
/**
 * Removes an download by id.
 */
function removeDownload(id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, TrackPlayer.removeDownload(id)];
        });
    });
}
/**
 * Toggle downloading.
 */
function toggleDownloadsPaused() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, TrackPlayer.toggleDownloadsPaused()];
        });
    });
}
/**
 * Resume downloading.
 */
function resumeDownloads() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, TrackPlayer.resumeDownloads()];
        });
    });
}
/**
 * Pause downloading.
 */
function pauseDownloads() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, TrackPlayer.pauseDownloads()];
        });
    });
}
/**
 * Gets Playback Parameters.
 */
function getPlaybackParameters() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, TrackPlayer.getPlaybackParameters()];
        });
    });
}
/**
 * Sets Playback Parameters.
 */
function setPlaybackParameters(paybackParameters) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, TrackPlayer.setPlaybackParameters(paybackParameters)];
        });
    });
}
/**
 * Gets Playback Speed.
 */
function getPlaybackSpeed() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, TrackPlayer.getPlaybackSpeed()];
        });
    });
}
/**
 * Sets Playback Speed.
 */
function setPlaybackSpeed(speed) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, TrackPlayer.setPlaybackSpeed(speed)];
        });
    });
}
/**
 * Gets Playback Pitch.
 */
function getPlaybackPitch() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, TrackPlayer.getPlaybackPitch()];
        });
    });
}
/**
 * Sets Playback Pitch.
 */
function setPlaybackPitch(pitch) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, TrackPlayer.setPlaybackPitch(pitch)];
        });
    });
}
/**
 * Gets the next item (with respecting shuffle mode)
 */
function hasNext() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, TrackPlayer.hasNext()];
        });
    });
}
/**
 * Gets the previous item (with respecting shuffle mode)
 */
function hasPrevious() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, TrackPlayer.hasPrevious()];
        });
    });
}
exports.default = {
    // MARK: - General API
    setupPlayer: setupPlayer,
    destroy: destroy,
    registerPlaybackService: registerPlaybackService,
    addEventListener: addEventListener,
    isServiceRunning: isServiceRunning,
    // MARK: - Queue API
    add: add,
    remove: remove,
    removeUpcomingTracks: removeUpcomingTracks,
    move: move,
    clear: clear,
    shuffle: shuffle,
    skip: skip,
    skipToNext: skipToNext,
    skipToPrevious: skipToPrevious,
    setShuffleModeEnabled: setShuffleModeEnabled,
    // MARK: - Control Center / Notifications API
    updateOptions: updateOptions,
    updateMetadataForTrack: updateMetadataForTrack,
    clearNowPlayingMetadata: clearNowPlayingMetadata,
    updateNowPlayingMetadata: updateNowPlayingMetadata,
    // MARK: - Player API
    reset: reset,
    play: play,
    pause: pause,
    stop: stop,
    seekTo: seekTo,
    // MARK: - Setters
    setVolume: setVolume,
    setRepeatMode: setRepeatMode,
    setPlaybackParameters: setPlaybackParameters,
    setPlaybackSpeed: setPlaybackSpeed,
    setPlaybackPitch: setPlaybackPitch,
    // MARK: - Getters
    hasPrevious: hasPrevious,
    hasNext: hasNext,
    getVolume: getVolume,
    getTrack: getTrack,
    getQueue: getQueue,
    getCurrentTrack: getCurrentTrack,
    getDuration: getDuration,
    getBufferedPosition: getBufferedPosition,
    getPosition: getPosition,
    getState: getState,
    getShuffleModeEnabled: getShuffleModeEnabled,
    getRepeatMode: getRepeatMode,
    getPlaybackParameters: getPlaybackParameters,
    getPlaybackSpeed: getPlaybackSpeed,
    getPlaybackPitch: getPlaybackPitch,
    // MARK: - Downloads
    addDownloads: addDownloads,
    removeDownload: removeDownload,
    clearDownloads: clearDownloads,
    getDownloadsPaused: getDownloadsPaused,
    getCurrentDownloads: getCurrentDownloads,
    getDownloads: getDownloads,
    getDownload: getDownload,
    setDownloadHeaders: setDownloadHeaders,
    toggleDownloadsPaused: toggleDownloadsPaused,
    resumeDownloads: resumeDownloads,
    pauseDownloads: pauseDownloads
};
