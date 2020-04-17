import createApp from "./app";
import * as bodyParser from "body-parser";
import log from "./common/logger";

log("info", "starting app...");

(async () => {
  let app = await createApp();
  app.server.use(bodyParser.urlencoded({ extended: true }));
  app.server.use(bodyParser.json());
  let sock = app.server.listen(3000);
  let user = await app.services.users.create({
    name: "Thomas",
    pass: "Secret",
    role: 0
  });

  app.services.linq.listen(33455);
  app.services.linq.on("heartbeat", serial => log("info", serial));
  await app.services.linq.run(50);
  await sock.close();
})();
