let path = require("path"),
  logger = require("./logger"),
  utils = require("./utils"),
  fs = require("fs"),
  cp = require("child_process");

(async () => {
  try {
    let { root } = await utils.seekRoot("atxmon"),
      args = process.argv.slice(2),
      env = Object.assign({}, process.env, {
        ATXMON_PATH: root,
        NODE_ENV: "production"
      }),
      shell = process.platform === "win32" ? true : false;
    await utils.spawn("node", ["./dist/app.js"], {
      stdio: "inherit",
      shell,
      env
    });
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
    }
  });
});
