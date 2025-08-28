import { type EventPayloadByEventWithType } from "../interfaces/EventPayloadByEvent";
import { Event } from "../constants/Event";
export declare function useTrackPlayerEvent<E extends Event, H extends (data: EventPayloadByEventWithType[E]) => void>(event: E, handler: H): void;
//# sourceMappingURL=useTrackPlayerEvent.d.ts.map