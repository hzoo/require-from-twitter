"use strict";

const fs = require("fs");
const babelrc = require("./package").babel;
const Babel = require("babel-standalone");
const decode = require("entities").decodeHTML;
const Twit = require("twit");

// edit twitter-config.json first
const twit = new Twit(require("./twitter-config"));
const tpmFolder = "tweet_modules";

/*
  Check for
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
*/
function hasExportsUsage(node) {
  return node.type === "ExpressionStatement" &&
  node.expression.type === "CallExpression" &&
  node.expression.callee === "MemberExpression" &&
  node.expression.callee.object === "Identifier" &&
  node.expression.callee.object.name === "Object" &&
  node.expression.callee.object.property.type === "Identifier" &&
  node.expression.callee.object.property.name === "defineProperty" &&
  node.expression.arguments.length === 3 &&
  node.expression.arguements[1].value === "__esModule"
}

function returnCode(text) {
  const exports = {};
  const res = Babel.transform(decode(text), babelrc);
  debugger;

  if (hasExportsUsage(ast.ast.program.body[0])) {
    eval(res.code);
    return exports.default;
  } else {
    throw new Error("Nothing was exported in the code. Use the export syntax like `export default function() {}`");
  }
}

function install(id, data) {
  fs.stat(tpmFolder, (e) => {
    if (e && e.code === "ENOENT") {
      fs.mkdirSync(tpmFolder);
    }

    fs.writeFile(tpmPath(id), data, "utf8", (err) => {
      if (err) {
        console.error(`Unable to create file at ${tpmPath(id)}`);
        throw err;
      }
    });
  });
}

function tpmPath(id) {
  return `${tpmFolder}/${id}.js`;
}

function getTweet(id) {
  return twit.get(`/statuses/show/:id`, { id })
  .then((tweet) => {
    if (tweet.errors) throw new Error(`Cannot find module "${id}"`);
    const data = tweet.data;

    install(id, JSON.stringify(data, [
      "created_at",
      "text",
      "user",
      "screen_name"
    ], 4));

    console.log(`Tweet ${id}: ${data.retweet_count} Retweets`);
    console.log(`@${data.user.screen_name} at ${data.created_at}`);
    console.log("===");
    console.log(data.text);
    console.log("---");

    return returnCode(data.text);
  });
}

module.exports = function requireFromTwitter(id) {
  debugger;
  let tweet;
  try {
    tweet = fs.readFileSync(tpmPath(id), "utf8");
  } catch (e) {
    if (e.code !== "ENOENT") Promise.reject(e);

    return Promise.resolve(getTweet(id));
  }

  return Promise.resolve(returnCode(JSON.parse(tweet).text));
}
