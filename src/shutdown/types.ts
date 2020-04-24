export interface ShutdownManager {
  shutdownPromise: Promise<boolean>;
  shutdown: () => void;
}
