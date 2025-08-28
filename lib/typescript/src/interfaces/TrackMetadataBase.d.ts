import { type ResourceObject } from "./ResourceObject";
export interface TrackMetadataBase {
    title?: string;
    album?: string;
    artist?: string;
    duration?: number;
    artwork?: string | ResourceObject;
    description?: string;
    genre?: string;
    date?: string;
    rating?: number | boolean;
    isLiveStream?: boolean;
}
//# sourceMappingURL=TrackMetadataBase.d.ts.map