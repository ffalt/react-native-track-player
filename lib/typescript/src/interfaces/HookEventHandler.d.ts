import { type EventPayloadByEventWithType } from "../interfaces/EventPayloadByEvent";
import { Event } from "../constants";
export type HookEventHandler<E extends Event> = (payload: EventPayloadByEventWithType[E]) => void;
//# sourceMappingURL=HookEventHandler.d.ts.map