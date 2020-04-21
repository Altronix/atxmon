import createServer from "./server";
import loadConfig, { root } from "./config";
(async () => {
  let server = await createServer(loadConfig(process.argv, process.env));

  let sock = server.app.listen(3000);

  server.utils.logger.info("Starting app...");

  await server.linq
    .listen(33455)
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
