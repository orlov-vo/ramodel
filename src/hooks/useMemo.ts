// Copyright 2020 the RaModel authors. All rights reserved. MIT license.
// Copyright 2018-2019 Matthew Phillips. All rights reserved. BSD 2-Clause license.

import { createHook } from '../core/hook';
import { State } from '../core/state';
import { hasChanged } from './hasChanged';

export const useMemo = createHook(<T>(_state: State) => {
  let value: T;
  let lastValues: unknown[] | undefined;

  return {
    update: (fn: () => T, values?: unknown[]): T => {
      if (hasChanged(values, lastValues)) {
        lastValues = values;
        value = fn();
      }
      return value;
    },
  };
});
