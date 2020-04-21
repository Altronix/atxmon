let path = require("path"),
  logger = require("./logger"),
  utils = require("./utils"),
  fs = require("fs"),
  cp = require("child_process");

(async () => {
  try {
    let root = await utils.seekRoot(),
      env = Object.assign({}, process.env, { ATXMON_PATH: root }),
      shell = process.platform === "win32" ? true : false,
      p = await cp.spawn("nodemon", [], { stdio: "inherit", shell, env });
  } catch (e) {
    logger.error(e);
  }
})();
