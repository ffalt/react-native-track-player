import { type Track } from "./Track";
import { type ResourceObject } from "./ResourceObject";

export type AddTrack = Track & {
  url: string | ResourceObject;
  artwork?: string | ResourceObject;
};
