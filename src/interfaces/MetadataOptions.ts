import { Capability } from "../constants/Capability";
import { RatingType } from "../constants/RatingType";
import { type FeedbackOptions } from "./FeedbackOptions";
import { type ResourceObject } from "./ResourceObject";


export interface MetadataOptions {
  ratingType?: RatingType;
  forwardJumpInterval?: number;
  backwardJumpInterval?: number;
  scrobble?: boolean;

  // ios
  likeOptions?: FeedbackOptions;
  dislikeOptions?: FeedbackOptions;
  bookmarkOptions?: FeedbackOptions;
  capabilities?: Capability[];

  // android
  stopWithApp?: boolean;
  alwaysPauseOnInterruption?: boolean;
  notificationCapabilities?: Capability[];
  compactCapabilities?: Capability[];

  icon?: string | ResourceObject;
  playIcon?: string | ResourceObject;
  pauseIcon?: string | ResourceObject;
  stopIcon?: string | ResourceObject;
  previousIcon?: string | ResourceObject;
  nextIcon?: string | ResourceObject;
  rewindIcon?: string | ResourceObject;
  forwardIcon?: string | ResourceObject;

  color?: number;
}
