import { ShutdownService } from "../shutdown.service";
test("shutdown.service should shutdown", async () => {
  let shutdownService = new ShutdownService();
  let emitterPass: boolean = false;
  let promisePass: boolean = false;
  shutdownService.on("shutdown", () => (emitterPass = true));
  shutdownService.shutdownPromise.then(() => (promisePass = true));
  expect(emitterPass).toBeFalsy();
  expect(promisePass).toBeFalsy();
  shutdownService.shutdown();
  await shutdownService.shutdownPromise;
  expect(emitterPass).toBeTruthy();
  expect(promisePass).toBeTruthy();
});
