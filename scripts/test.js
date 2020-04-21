let path = require("path"),
  logger = require("./logger"),
  utils = require("./utils"),
  fs = require("fs"),
  cp = require("child_process");

(async () => {
  try {
    let root = await utils.seekRoot(),
      args = process.argv[2] ? ["-t", process.argv[2]] : [],
      env = Object.assign({}, process.env, { ATXMON_PATH: root }),
      shell = process.platform === "win32" ? true : false;
    if (process.argv[3]) args.push("--collect-coverage");
    p = await cp.spawn("jest", args, { stdio: "inherit", shell, env });
  } catch (e) {
    logger.error(e);
  }
})();
