import createServer from "./server";
import load from "./config";

(async () => {
  // Check environment (required for reading typeorm entities)
  if (!process.env.ATXMON_PATH) {
    console.error("[ \x1b[35mFATAL\x1b[0m ] atxmon startup error...");
    console.error("[ \x1b[35mFATAL\x1b[0m ] Please checkout README.md");
    process.exit(-1);
  }

  // Start application
  let config = load(process.argv, process.env);
  let server = await createServer(config);
  server.utils.logger.info(`Listening [HTTP] ${config.http.http}`);
  server.utils.logger.info(`Listening [ZMTP] ${config.linq.zmtp}`);
  let sock = server.app.listen(config.http.http);
  await server.linq
    .listen(config.linq.zmtp[0])
    .on("heartbeat", async serial => {
      server.utils.logger.info(`${serial}`);
    })
    .on("alert", async event => {
      server.utils.logger.info(`${event}`);
    })
    .on("error", async (error, what) => {
      server.utils.logger.info(`${error} ${what}`);
    })
    .on("ctrlc", async serial => {
      server.utils.logger.info("Shutting down...");
      await sock.close();
    })
    .run(500);
})();
