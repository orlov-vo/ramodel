// Copyright 2020 the RaModel authors. All rights reserved. MIT license.

import { createInstance } from './createInstance';
import { useState } from '../hooks/mod';
import { createModel } from './createModel';

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

  it('should throw error on update when you use different count of hooks in model', () => {
    class MyModel extends createModel(() => {
      const [value, update] = useState(false);
      if (value) {
        const [check] = useState(true);
        return { check, update };
      }
      return { check: false, update };
    }) {}
    const instance = new MyModel({});

    expect(instance).toHaveProperty('update');
    expect(instance.update(true)).rejects.toThrow(
      'It seems you change count of hooks in MyModel. Often it can happen when you are using if/loop statements in model',
    );
  });
});
