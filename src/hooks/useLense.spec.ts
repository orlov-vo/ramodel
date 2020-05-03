// Copyright 2020 the RaModel authors. All rights reserved. MIT license.

import { createInstance } from '../core/createInstance';
import { makeLense } from '../core/lense';
import { useState } from './useState';
import { useLense } from './useLense';

describe('useLense', () => {
  test('should return actual state immediately', async () => {
    const foo = createInstance({}, () => ({ bar: 'baz' }));
    const fooLense = makeLense(foo, _ => _.bar);

    const instance = createInstance({}, () => {
      const value = useLense(fooLense);
      return { value };
    });

    expect(instance).toHaveProperty('value', 'baz');
  });

  test('should return actual state after update', async () => {
    const parent = createInstance({}, () => {
      const [value, setValue] = useState('foo');
      return { value, setValue };
    });
    const fooLense = makeLense(parent, _ => _.value);

    const instance = createInstance({}, () => {
      const value = useLense(fooLense);
      return { value };
    });

    expect(instance).toHaveProperty('value', 'foo');

    parent.setValue('bar');

    expect(instance).toHaveProperty('value', 'bar');
  });
});
