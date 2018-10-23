import test from 'ava';
import range from '../src/util/range';

test('creates an iterable range from 0 to a number', t => {
  t.plan(5);

  for (const n of range(5)) {
    t.pass();
  }
});
