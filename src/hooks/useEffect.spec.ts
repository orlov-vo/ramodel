// Copyright 2020 the RaModel authors. All rights reserved. MIT license.

import { createInstance } from '../core/createInstance';
import { destroy } from '../core/destroy';
import { useState } from './useState';
import { useEffect } from './useEffect';

const defer = Promise.resolve().then.bind(Promise.resolve());

describe('useEffect', () => {
  test('handler should be properly called on every change in values', async () => {
    const onStart = jest.fn();
    const onEnd = jest.fn();

    const instance = createInstance({}, () => {
      const [value, setValue] = useState(0);

      useEffect(() => {
        onStart();

        return () => {
          onEnd();
        };
      }, [value]);

      return { setValue };
    });

    await defer(() => instance.setValue(1));
    await defer(() => instance.setValue(2));
    await defer(() => instance.setValue(3));
    await defer(() => {});

    expect(onStart).toHaveBeenCalledTimes(4);
    expect(onEnd).toHaveBeenCalledTimes(3);

    destroy(instance);

    expect(onStart).toHaveBeenCalledTimes(4);
    expect(onEnd).toHaveBeenCalledTimes(4);
  });
});
