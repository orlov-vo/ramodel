// Copyright 2020 the RaModel authors. All rights reserved. MIT license.

import { createInstance } from './createInstance';

describe('createModel', () => {
  test('init empty model', () => {
    const input = {};
    const mainFn = jest.fn(() => ({}));
    const instance = createInstance(input, mainFn);

    // Micro-hack to flush all tasks via read state
    ((() => {}) as any)((instance as any).foo);

    expect(mainFn).toHaveBeenCalledTimes(1);
    expect(mainFn).toHaveBeenCalledWith(input);
  });

  test('init model with static fields', () => {
    const mainFn = jest.fn(({ input }) => ({ input, foo: 'bar' }));
    const instance = createInstance({ input: 'test' }, mainFn);

    expect(instance).toHaveProperty('input', 'test');
    expect(instance).toHaveProperty('foo', 'bar');

    expect(mainFn).toHaveBeenCalledTimes(1);
  });
});
