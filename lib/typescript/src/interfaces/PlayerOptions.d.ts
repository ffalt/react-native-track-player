import { IOSCategory } from "../constants/IOSCategory";
import { IOSCategoryMode } from "../constants/IOSCategoryMode";
import { IOSCategoryOptions } from "../constants/IOSCategoryOptions";
export interface PlayerOptions {
    /**
     * Minimum time in seconds that needs to be buffered.
     */
    minBuffer?: number;
    /**
     * Maximum time in seconds that needs to be buffered
     */
    maxBuffer?: number;
    /**
     * Time in seconds that should be kept in the buffer behind the current playhead time.
     */
    backBuffer?: number;
    /**
     * Minimum time in seconds that needs to be buffered to start playing.
     */
    playBuffer?: number;
    /**
     * Maximum cache size in kilobytes.
     */
    maxCacheSize?: number;
    /**
     * [AVAudioSession.Category](https://developer.apple.com/documentation/avfoundation/avaudiosession/1616615-category) for iOS.
     * Sets on `play()`.
     */
    iosCategory?: IOSCategory;
    /**
     * [AVAudioSession.Mode](https://developer.apple.com/documentation/avfoundation/avaudiosession/1616508-mode) for iOS.
     * Sets on `play()`.
     */
    iosCategoryMode?: IOSCategoryMode;
    /**
     * [AVAudioSession.CategoryOptions](https://developer.apple.com/documentation/avfoundation/avaudiosession/1616503-categoryoptions) for iOS.
     * Sets on `play()`.
     */
    iosCategoryOptions?: IOSCategoryOptions[];
    /**
     * Indicates whether the player should automatically delay playback in order to minimize stalling.
     * Defaults to `false`.
     */
    waitForBuffer?: boolean;
    /**
     * Indicates whether the player should automatically update now playing metadata data in control center / notification.
     * Defaults to `true`.
     */
    autoUpdateMetadata?: boolean;
}
//# sourceMappingURL=PlayerOptions.d.ts.map