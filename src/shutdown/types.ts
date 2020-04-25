export interface ShutdownManager {
  on: (ev: string, handler: (...args: any[]) => void) => void;
  shutdownPromise: Promise<boolean>;
  shutdown: () => void;
}
