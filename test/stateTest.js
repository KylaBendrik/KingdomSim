import test from 'ava';
import State from '../src/state';

test('finds a structure by id', t => {
  const structure = { structureNum: 1 };

  State.structures.push(structure);

  t.is(State.findStructure(1), structure);
});
