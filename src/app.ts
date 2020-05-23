import "dotenv/config";
import { createServer, Server } from "./server";
import { allEvents } from "./events";
import { toSnakeCase } from "./common/case";
import { DeviceModelEntry } from "./device/device.model";

async function start() {
  // Check environment (required for reading typeorm entities)
  if (!process.env.ATXMON_PATH) {
    console.error("[ \x1b[35mFATAL\x1b[0m ] atxmon startup error...");
    console.error("[ \x1b[35mFATAL\x1b[0m ] Please checkout README.md");
    process.exit(-1);
  }

  // Make sure environment is secure
  if (
    !(
      process.env.ACCESS_TOKEN_SECRET &&
      process.env.REFRESH_TOKEN_SECRET &&
      process.env.ADMIN_FIRSTNAME &&
      process.env.ADMIN_LASTNAME &&
      process.env.ADMIN_PHONE &&
      process.env.ADMIN_EMAIL &&
      process.env.ADMIN_PASSWORD
    )
  ) {
    console.error("[ \x1b[35mFATAL\x1b[0m ] Warning UNSAFE instance!");
    console.error("[ \x1b[35mFATAL\x1b[0m ] Security environment invalid");
    process.exit(-1);
  }

  // Start application
  let server = await createServer();
  server.utils.logger.info(`Listening [HTTP] ${server.config.http.http}`);
  server.utils.logger.info(`Listening [ZMTP] ${server.config.linq.zmtp}`);

  if (!(await server.users.findByEmail(process.env.ADMIN_EMAIL))) {
    server.utils.logger.warn(`Admin account not found!!`);
    server.utils.logger.warn(`Creating admin account...`);
    await server.users.create({
      firstName: process.env.ADMIN_FIRSTNAME,
      lastName: process.env.ADMIN_LASTNAME,
      phone: process.env.ADMIN_PHONE,
      email: process.env.ADMIN_EMAIL,
      role: 0,
      password: process.env.ADMIN_PASSWORD
    });
    server.utils.logger.warn(`Admin account created`);
  }

  let sock = server.app.listen(server.config.http.http);
  let subscription = server.linq
    .init()
    .listen(server.config.linq.zmtp[0])
    .events$.pipe(allEvents({ emailBatchInterval: 60000 }))
    .subscribe(async ev => {
      switch (ev.type) {
        case "new":
          let device = await server.devices.findById(ev.sid);
          if (!device) {
            server.utils.logger.info(`[NEW] [${ev.sid}]`);
            await server.devices.create({
              serial: ev.sid,
              ...toSnakeCase<DeviceModelEntry>(ev)
            });
          }
          break;
        case "heartbeat":
          server.utils.logger.info(`[HEARTBEAT] [${ev.serial}]`);
          let d = await server.devices.findById(ev.serial);
          await server.devices.update(ev.serial, {
            last_seen: Math.floor(new Date().getTime() / 1000)
          });
          break;
        case "alert":
          server.utils.logger.info(`[ALERT] [${ev.mesg}]`);
          await server.alerts.create(ev);
          break;
        case "email":
          Object.keys(ev.alerts).forEach(key => {
            // TODO we collected an interval of emails per each device
            // alerts is keyed with the serial number of the device and the
            // keyed value is an array of events
            // ie: ev.alerts[key]:Event[]
          });
          break;
        case "error":
          server.utils.logger.info(JSON.stringify(ev));
          // TODO create an error entity and stick in there
          break;
        case "ctrlc":
          server.utils.logger.info(JSON.stringify(ev));
          break;
      }
    });
  let whileRunning = server.linq.run(100);

  server.shutdown.on("shutdown", async () => server.linq.shutdown());
  await Promise.race([server.shutdown.shutdownPromise, whileRunning]);

  server.utils.logger.info("Shutting down. Please wait...");
  await Promise.all([
    server.shutdown.shutdownPromise,
    whileRunning,
    sock.close()
  ]);

  subscription.unsubscribe();
  return 0;
}

(async () => {
  return await start();
})();
