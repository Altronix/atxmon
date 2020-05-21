import {
  EVENTS,
  Events,
  NewEvent,
  HeartbeatEvent,
  AlertEvent,
  ErrorEvent,
  CtrlcEvent
} from "./device/linq.service";
import { Observable, merge } from "rxjs";
import { filter, map, bufferTime, mergeMap } from "rxjs/operators";

type APP_EVENTS = EVENTS | "email";
interface EmailEvent {
  type: "email";
  alerts: AlertEvent[];
}

export const heartbeats = () => (
  s: Observable<Events>
): Observable<HeartbeatEvent> =>
  s.pipe(filter((e: Events): e is HeartbeatEvent => e.type === "heartbeat"));

export const news = () => (s: Observable<Events>): Observable<NewEvent> =>
  s.pipe(filter((e: Events): e is NewEvent => e.type === "new"));

export const alerts = () => (s: Observable<Events>): Observable<AlertEvent> =>
  s.pipe(filter((e: Events): e is AlertEvent => e.type === "alert"));

export const errors = () => (s: Observable<Events>): Observable<ErrorEvent> =>
  s.pipe(filter((e: Events): e is ErrorEvent => e.type === "alert"));

export const ctrlcs = () => (s: Observable<Events>): Observable<CtrlcEvent> =>
  s.pipe(filter((e: Events): e is CtrlcEvent => e.type === "ctrlc"));

export const emails = () => (s: Observable<Events>): Observable<EmailEvent> =>
  s.pipe(
    alerts(),
    bufferTime(60000),
    map(e => ({
      type: "email",
      alerts: e
    }))
  );

export const allEvents = () => (s: Observable<Events>) =>
  merge(
    s.pipe(news()),
    s.pipe(heartbeats()),
    s.pipe(alerts()),
    s.pipe(emails()),
    s.pipe(errors()),
    s.pipe(ctrlcs())
  );
