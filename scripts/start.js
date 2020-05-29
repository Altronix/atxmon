let path = require("path"),
  logger = require("./logger"),
  utils = require("./utils"),
  fs = require("fs"),
  cp = require("child_process");

(async () => {
  try {
    let { root } = await utils.seekRoot("atxmon"),
      args = process.argv.slice(2),
      env = Object.assign({}, process.env, { ATXMON_PATH: root }),
      shell = process.platform === "win32" ? true : false;
    await utils.spawn("nodemon", args, { stdio: "inherit", shell, env });
    return 0;
  } catch (e) {
    logger.error(e);
  }
})();

let shuttingDown = false;
["SIGINT", "SIGTERM"].forEach(function(sig) {
  process.on(sig, async function() {
    if (!shuttingDown) {
      shuttingDown = true;
      logger.info("Waiting for app to shutdown...");
      logger.debug("TODO Press ctrlc again until we fix start script");
    }
  });
});
