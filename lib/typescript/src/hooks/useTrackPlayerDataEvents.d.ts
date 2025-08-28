import { Event } from "../constants/Event";
export declare function useTrackPlayerDataEvents<T, S = void>(events: Array<Event>, handler: (payload?: S) => Promise<T>, defaultValue: T, compareFunc?: (prev: T, next: T) => boolean): T;
//# sourceMappingURL=useTrackPlayerDataEvents.d.ts.map