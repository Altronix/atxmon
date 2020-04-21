// utils.js

let path = require("path"),
  fs = require("fs"),
  cross = require("cross-env");

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
exports.seekRoot = async function() {
  let count = 5,
    start = await exports.moduleLocation();
  return new Promise((resolve, reject) => {
    (async function seek(p, n) {
      try {
        let json = await exports.parseJsonPackage(
          p + "/package.json",
          "atxmon"
        );
        resolve(p);
      } catch {
        if (n) {
          p += "/..";
          await seek(p, --n);
        } else {
          reject(new Error("Could not find package.json"));
        }
      }
    })(start, count);
  });
};

// Get package.json
exports.parseJsonPackage = async function(file, name = "atxmon") {
  file = file ? file : (await exports.root()) + "/../package.json";
  let pack = JSON.parse(await fs.promises.readFile(file));
  if (!(pack.name === name)) {
    throw new Error("Correct package.json not found!");
  }
  return pack;
};
