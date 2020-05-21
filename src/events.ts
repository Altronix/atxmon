import {
  Events,
  NewEvent,
  HeartbeatEvent,
  AlertEvent,
  ErrorEvent,
  CtrlcEvent
} from "./device/linq.service";
import { Observable, merge } from "rxjs";
import { filter, map, bufferTime } from "rxjs/operators";

interface EmailEvent {
  type: "email";
  alerts: AlertEvent[];
}

export interface EventsConfig {
  emailBufferInterval?: number;
}

export const heartbeats = (config?: EventsConfig) => (
  s: Observable<Events>
): Observable<HeartbeatEvent> =>
  s.pipe(filter((e: Events): e is HeartbeatEvent => e.type === "heartbeat"));

export const news = (config?: EventsConfig) => (
  s: Observable<Events>
): Observable<NewEvent> =>
  s.pipe(filter((e: Events): e is NewEvent => e.type === "new"));

export const alerts = (config?: EventsConfig) => (
  s: Observable<Events>
): Observable<AlertEvent> =>
  s.pipe(filter((e: Events): e is AlertEvent => e.type === "alert"));

export const errors = (config?: EventsConfig) => (
  s: Observable<Events>
): Observable<ErrorEvent> =>
  s.pipe(filter((e: Events): e is ErrorEvent => e.type === "alert"));

export const ctrlcs = (config?: EventsConfig) => (
  s: Observable<Events>
): Observable<CtrlcEvent> =>
  s.pipe(filter((e: Events): e is CtrlcEvent => e.type === "ctrlc"));

export const emails = (config?: EventsConfig) => (
  s: Observable<Events>
): Observable<EmailEvent> =>
  s.pipe(
    alerts(),
    bufferTime((config && config.emailBufferInterval) || 60000),
    map(e => ({
      type: "email",
      alerts: e
    }))
  );

export const allEvents = (config?: EventsConfig) => (s: Observable<Events>) =>
  merge(
    s.pipe(news(config)),
    s.pipe(heartbeats(config)),
    s.pipe(alerts(config)),
    s.pipe(emails(config)),
    s.pipe(errors(config)),
    s.pipe(ctrlcs(config))
  );
