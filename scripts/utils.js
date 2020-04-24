// utils.js

let path = require("path"),
  fs = require("fs"),
  cross = require("cross-env"),
  cp = require("child_process"),
  logger = require("./logger");

exports = module.exports;

// Get location of our script
exports.moduleLocation = async function() {
  let filename =
    (require.main && require.main.filename) ||
    (process.mainModule && process.mainModule.filename);
  if (!filename) throw new Error("System not supported");
  return path.dirname(filename);
};

// Find our package.json
exports.seekRoot = async function(name = "") {
  const filename =
      (require.main && require.main.filename) ||
      (process.mainModule && process.mainModule.filename),
    start = path.join(path.dirname(filename), ".."),
    count = 10;
  return await (async function seek(start, count) {
    try {
      let file = await fs.promises.readFile(path.join(start, "package.json"));
      let test = JSON.parse(file);
      if (name.length && test.name === name) {
        return { root: start, json: test };
      } else {
        return count ? seek(path.join(start, ".."), --count) : undefined;
      }
    } catch (e) {
      console.log(e);
      return count ? seek(path.join(start, ".."), --count) : undefined;
    }
  })(start, count);
};

exports.startAtxmonContainer = async function(userConfig = {}) {
  let config = Object.assign(
    {},
    {
      name: "atxmon",
      httpPort: 8000,
      httpsPort: 8001,
      zmtpPort: 33455,
      zmtpsPort: 33456
    },
    userConfig
  );
  let args = (
    `run -d --name=${config.name} ` +
    `-p ${config.httpPort}:8000 ` +
    `-p ${config.httpsPort}:8001 ` +
    `-p ${config.zmtpPort}:33455 ` +
    `-p ${config.zmtpsPort}:33456 ` +
    `altronix/atxmon ` +
    `--httpPort 8000 ` +
    `--httpsPort 8001 ` +
    `--zmtpPort 33455 ` +
    `--zmtpsPort 33456}`
  ).split(" ");
  logger.info(`Container... HTTP=${config.httpPort} ZMTP=${config.zmtpPort}`);
  let shell = process.platform === "win32" ? true : false;
  return cp.spawn("docker", args, {
    stdio: ["inherit", "ignore", "inherit"],
    shell
  });
};

exports.stopDockerContainer = async function(name) {
  let kill = `kill ${name}`.split(" ");
  let rm = `rm ${name}`.split(" ");
  let shell = process.platform === "win32" ? true : false;
  return new Promise(resolve => {
    logger.info(`Killing container ${name}`);
    cp.spawn("docker", kill, {
      stdio: ["inherit", "ignore", "inherit"],
      shell
    }).on("exit", () => {
      logger.info(`Removing container ${name}`);
      cp.spawn("docker", rm, {
        stdio: ["inherit", "ignore", "inherit"],
        shell
      }).on("exit", () => resolve());
    });
  });
};
