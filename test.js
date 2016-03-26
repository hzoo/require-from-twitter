const requireFromTwitter = require('./');
const assert = require('assert');

// es6 left pad
const leftPad = requireFromTwitter('712799807073419264');
const res1 = leftPad(1, 5);
assert(res1 === '00001');

const res2 = leftPad(1234, 5);
assert(res2 === '01234');

const res3 = leftPad(12345, 5);
assert(res3 === '12345');

// test async

// some sort
requireFromTwitter.async('713782217646931968')
.then((sort) => {
  var arr = [2,1];
  var sortArr = sort(arr);
  [1,2].forEach((elem, i) => assert(elem === sortArr[i]));
  console.log('All passed! 🎉');
});
