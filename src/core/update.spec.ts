// Copyright 2020 the RaModel authors. All rights reserved. MIT license.

import { createInstance } from './createInstance';
import { update } from './update';

describe('update', () => {
  test('replace input after update', () => {
    const mainFn = jest.fn(input => ({ ...input }));
    const inputOne = { foo: '1' };
    const inputTwo = { foo: '2' };
    const instance = createInstance(inputOne, mainFn);

    expect(instance).toHaveProperty('foo', '1');
    expect(mainFn).toHaveBeenLastCalledWith(inputOne);

    update(instance, { foo: '2' });
    expect(instance).toHaveProperty('foo', '2');
    expect(mainFn).toHaveBeenLastCalledWith(inputTwo);
  });
});
