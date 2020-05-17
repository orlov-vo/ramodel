// Copyright 2020 the RaModel authors. All rights reserved. MIT license.

import { createInstance } from '../core/createInstance';
import { createLens } from '../core/lens';
import { useState } from './useState';
import { useLens } from './useLens';

describe('useLens', () => {
  test('should return actual state immediately', async () => {
    const foo = createInstance({}, () => ({ bar: 'baz' }));
    const fooLens = createLens(foo, _ => _.bar);

    const instance = createInstance({}, () => {
      const value = useLens(fooLens);
      return { value };
    });

    expect(instance).toHaveProperty('value', 'baz');
  });

  test('should return actual state after update', async () => {
    const parent = createInstance({}, () => {
      const [value, setValue] = useState('foo');
      return { value, setValue };
    });
    const fooLens = createLens(parent, _ => _.value);

    const instance = createInstance({}, () => {
      const value = useLens(fooLens);
      return { value };
    });

    expect(instance).toHaveProperty('value', 'foo');
    expect(parent).toHaveProperty('value', 'foo');

    await parent.setValue('bar');

    expect(instance).toHaveProperty('value', 'bar');
    expect(parent).toHaveProperty('value', 'bar');
  });
});
