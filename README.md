
## Setup
Create a `twitter-config.js` with the following filled out:

```js
module.exports = {
  "consumer_key": "",
  "consumer_secret": "",
  "access_token": "",
  "access_token_secret": ""
};
```

## Modules

Expects a `twitter:` namespace in each file.
To read a module, it just needs to be a JSON file with a `text` property.

```js
// twitter_modules/twitter:712799807073419264.js
{
    "created_at": "Thu Mar 24 00:34:51 +0000 2016",
    "text": "// ES6 leftPad\nexport default (v, n, c = '0') =&gt; String(v).length &gt;= n ? '' + v : (String(c).repeat(n) + v).slice(-n);",
    "id_str": "712799807073419264",
    "user": {
        "created_at": "Tue Jul 22 22:54:37 +0000 2008",
        "id_str": "15540222",
        "screen_name": "rauchg"
    }
}
```

## Usage

```js
// sync (already installed)
const requireFromTwitter = require('require-from-twitter');
const leftPad = requireFromTwitter('712799807073419264');
leftPad(1, 5); // '00001'
```

```js
const requireFromTwitter = require('require-from-twitter').async;
async function test() {
    const leftPad = await requireFromTwitter('712799807073419264');
    leftPad(1, 5); // '00001'
}
```

Default folder: `tweet_modules`

Override with `twpm` key in `package.json`:
```js
{
    "name": "package1",
    "dependencies": {},
    "twpm": {
        "modulesLocation": "twpm_modules"
    }
}


## Tests

`npm i twpm -g`
`npm t`
