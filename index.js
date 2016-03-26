"use strict";

const fs = require("fs");
const path = require("path");
const child = require("child_process");
const decode = require("entities").decodeHTML;
const Babel = require("babel-standalone");
const babelrc = require("./package").babel;

function execSync(cmd) {
  return child.execSync(cmd, {
    encoding: "utf8"
  }).trim();
};

function getTopLevelDirectory() {
  return execSync("git rev-parse --show-toplevel");
};

const rootPath = getTopLevelDirectory();
const packageLoc = path.join(rootPath, "package.json");
const pkg = require(packageLoc);

const lppmrc = pkg.lppm;
const lppmModulesName = lppmrc && lppmrc.modulesLocation || "tweet_modules";
const lppmFolder = path.join(rootPath, lppmModulesName);

function modulesPath(moduleName) {
  return `${lppmFolder}/${moduleName}.js`;
}

/*
  Check for
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
*/
function hasExportsUsage(node) {
  return node.type === "ExpressionStatement" &&
  node.expression.type === "CallExpression" &&
  node.expression.callee.type === "MemberExpression" &&
  node.expression.callee.object.type === "Identifier" &&
  node.expression.callee.object.name === "Object" &&
  node.expression.callee.property.type === "Identifier" &&
  node.expression.callee.property.name === "defineProperty" &&
  node.expression.arguments.length === 3 &&
  node.expression.arguments[1].value === "__esModule"
}

function returnCode(text) {
  const exports = {};
  const res = Babel.transform(decode(text), babelrc);

  if (hasExportsUsage(res.ast.program.body[0])) {
    eval(res.code);
    return exports.default;
  } else {
    throw new Error("Nothing was exported in the code. Use the export syntax like `export default function() {}`");
  }
}

function getModule(id, source) {
  let module;
  try {
    module = fs.readFileSync(modulesPath(`${source}:${id}`), "utf8");
  } catch (e) {
    if (e.code !== "ENOENT") {
      throw new Error(e);
    }

    throw new Error(`${id} not found. Did you 'lppm install ${id}'?`);
  }

  return module;
}

function requireFromTwitter(id) {
  let name = pkg.lppmDependencies && pkg.lppmDependencies[id] || id;

  const tweet = getModule(name, 'twitter');
  return returnCode(JSON.parse(tweet).text);
}

// fun
requireFromTwitter.async = function(id) {
  return new Promise((resolve, reject) => {
    fs.readFile(modulesPath(`twitter:${id}`), "utf8", (e, tweet) => {
      if (e) {
        try {
          execSync(`lppm i ${id}`);
        } catch (e) {
          console.log();
          console.log(`${id} not found. You can use lppm to install.`);
          console.log(`npm install lppm -g`);
          console.log(`lppm install ${id}`);
          return reject();
        }
        return resolve(requireFromTwitter(id));
      }

      return resolve(returnCode(JSON.parse(tweet).text));
    });
  });
}

module.exports = requireFromTwitter;
