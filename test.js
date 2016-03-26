const requireFromTwitter = require('./');
const assert = require('assert');

// es6 left pad
requireFromTwitter('712799807073419264')
.then((leftPad) => {
  const res1 = leftPad(1, 5);
  console.log(res1);
  assert(res1 === '00001');

  const res2 = leftPad(1234, 5);
  console.log(res2);
  assert(res2 === '01234');

  const res3 = leftPad(12345, 5);
  console.log(res3);
  assert(res3 === '12345');
}, (err) => console.error(err.stack));

// resolve promise with callback
requireFromTwitter('713712471333343232')
.then((resolvePromise) => {
  resolvePromise(
    requireFromTwitter('712799807073419264'),
    (_, leftPad) => {
      const res4 = leftPad(1, 5);
      console.log(res4);
      assert(res4 === '00001');
  });
}, (err) => console.error(err.stack));
