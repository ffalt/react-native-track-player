import { type EventPayloadByEvent, type EventPayloadByEventWithType } from "../interfaces/EventPayloadByEvent";
import { Event } from "../constants";
export declare function useTrackPlayerDataEvent<T, E extends Event>(event: E, handler: (payload?: EventPayloadByEvent[E]) => Promise<T>, defaultValue: T, compareFunc?: (prev: T, next: T) => boolean, filter?: (payload?: EventPayloadByEventWithType[E]) => boolean): T;
//# sourceMappingURL=useTrackPlayerDataEvent.d.ts.map