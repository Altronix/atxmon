import createServer from "./server";
import load from "./config";
(async () => {
  let config = load(process.argv, process.env);
  let server = await createServer(config);

  if (!process.env.ATXMON_PATH) {
    server.utils.logger.fatal(
      "Please use ./start.js for proper runtime env.",
      -1
    );
  }

  let sock = server.app.listen(config.http.http);

  server.utils.logger.info("Starting app...");

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
