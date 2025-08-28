import { Event } from "../constants/Event";

export interface EventPayload {
  type: Event;

  [key: string]: unknown;
}

