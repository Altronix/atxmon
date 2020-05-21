import "dotenv/config";
import createServer from "./server";

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
    .events$.subscribe(e => {
      switch (e.type) {
        case "new":
          server.utils.logger.info(JSON.stringify(e));
          break;
        case "heartbeat":
          server.utils.logger.info(JSON.stringify(e));
          break;
        case "alert":
          server.utils.logger.info(JSON.stringify(e));
          break;
        case "error":
          server.utils.logger.info(JSON.stringify(e));
          break;
        case "ctrlc":
          server.utils.logger.info(JSON.stringify(e));
          break;
      }
    });
  let linq = server.linq.run(100);

  server.shutdown.on("shutdown", async () => server.linq.shutdown());
  await Promise.race([server.shutdown.shutdownPromise, linq]);

  server.utils.logger.info("Shutting down. Please wait...");
  await Promise.all([server.shutdown.shutdownPromise, linq, sock.close()]);

  subscription.unsubscribe();
  return 0;
}

(async () => {
  return await start();
})();
