require-from-twitter
===

require(), but from a tweet.

> https://twitter.com/rauchg/status/712800259089391617
> Mandatory disclaimer: this is not serious and not safe.
> Will probably change a lot.

## Setup
In your top level directory where you will be using this, create a `twitter-config.js` with the following filled out:

```js
module.exports = {
  "consumer_key": "",
  "consumer_secret": "",
  "access_token": "",
  "access_token_secret": ""
};
```

> TODO: fallback to request from url?

## Modules

Expects a `twitter:` namespace in each file.
To read a module, it just needs to be a JSON file with a `text` property.

```js
// twitter_modules/twitter:712799807073419264.js
{
    "created_at": "Thu Mar 24 00:34:51 +0000 2016",
    "text": "// ES6 leftPad\nexport default (v, n, c = '0') =&gt; String(v).length &gt;= n ? '' + v : (String(c).repeat(n) + v).slice(-n);", // reads this property
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
// TODO: should install it automatically?
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

# install twpm
`npm i twpm -g`
# install modules
`twpm install`
# run tests
`npm t`
