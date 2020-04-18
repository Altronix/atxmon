import createApp from "./app";
import * as bodyParser from "body-parser";
import log from "./common/logger";

log("info", "starting app...");

(async () => {
  let app = await createApp();
  app.load();
  let sock = app.server.listen(3000);
  let user = await app.services.users.create({
    name: "Thomas",
    pass: "Secret",
    role: 0
  });

  await app.services.linq
    .listen(33455)
    .on("heartbeat", async serial => {
      log("info", `${serial}`);
    })
    .on("alert", async event => {
      log("info", `${event}`);
    })
    .on("error", async (error, what) => {
      log("info", `${error} ${what}`);
    })
    .on("ctrlc", async serial => {
      log("warn", "Shutting down...");
      await sock.close();
    })
    .run(50);
})();
