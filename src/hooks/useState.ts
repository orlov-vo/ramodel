// Copyright 2020 the RaModel authors. All rights reserved. MIT license.
// Copyright 2018-2019 Matthew Phillips. All rights reserved. BSD 2-Clause license.

import { createHook } from '../core/hook';
import { State } from '../core/state';

type NewState<T> = T | ((previousState: T) => T);
type StateUpdater<T> = (value: NewState<T>) => Promise<void>;

export const useState = createHook(<T>(state: State) => {
  let args: readonly [T, StateUpdater<T>];

  const makeArgs = (value: T): void => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    args = Object.freeze([value, updater] as const);
  };

  const updater = async (value: NewState<T>): Promise<void> => {
    const [previousValue] = args;
    const newValue = typeof value === 'function' ? (value as (previousState?: T) => T)(previousValue) : value;

    if (newValue !== previousValue) {
      makeArgs(newValue);
      await state.update();
    }
  };

  return {
    update: (initialValue: T): typeof args => {
      if (args === undefined) {
        makeArgs(typeof initialValue === 'function' ? initialValue() : initialValue);
      }

      return args;
    },
  };
});
