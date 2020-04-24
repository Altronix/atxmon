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
exports.seekRoot = async function(name = "") {
  const filename =
      (require.main && require.main.filename) ||
      (process.mainModule && process.mainModule.filename),
    start = path.join(path.dirname(filename), ".."),
    count = 10;
  let json = await (async function seek(start, count) {
    try {
      let file = await fs.promises.readFile(path.join(start, "package.json"));
      let test = JSON.parse(file);
      if (name.length && test.name === name) {
        return test;
      } else {
        return count ? seek(path.join(start, ".."), --count) : undefined;
      }
    } catch {
      return count ? seek(path.join(start, ".."), --count) : undefined;
    }
  })();
};
