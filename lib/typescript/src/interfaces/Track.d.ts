import { type TrackMetadataBase } from "./TrackMetadataBase";
import { TrackType } from "../constants/TrackType";
import { PitchAlgorithm } from "../constants/PitchAlgorithm";
import { type ResourceObject } from "./ResourceObject";
export interface Track extends TrackMetadataBase {
    id?: string;
    url: string | ResourceObject;
    type?: TrackType;
    userAgent?: string;
    contentType?: string;
    pitchAlgorithm?: PitchAlgorithm;
    headers?: {
        [key: string]: string;
    };
    [key: string]: unknown;
}
//# sourceMappingURL=Track.d.ts.map