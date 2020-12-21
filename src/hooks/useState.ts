// Copyright 2020 the RaModel authors. All rights reserved. MIT license.
// Copyright 2018-2019 Matthew Phillips. All rights reserved. BSD 2-Clause license.

import { createHook } from '../core/hook';
import { State } from '../core/state';

type CreateStateFn<T> = () => T;
type InitialState<T> = T | CreateStateFn<T>;
type UpdateStateFn<T> = (previousState: T) => T;
type NewState<T> = T | UpdateStateFn<T>;
type StateUpdater<T> = (value: NewState<T>) => Promise<void>;

function isCreateStateFn<T>(value: InitialState<T>): value is CreateStateFn<T> {
  return typeof value === 'function';
}

function isUpdateStateFn<T>(value: NewState<T>): value is UpdateStateFn<T> {
  return typeof value === 'function';
}

export const useState = createHook(<T>(state: State) => {
  let args: readonly [T, StateUpdater<T>];

  function makeArgs(value: T): void {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    args = Object.freeze([value, updater] as const);
  }

  async function updater(value: NewState<T>): Promise<void> {
    const [previousValue] = args;
    const newValue = isUpdateStateFn(value) ? value(previousValue) : value;

    if (newValue !== previousValue) {
      makeArgs(newValue);
      await state.update();
    }
  }

  return {
    update: (initialValue: InitialState<T>): typeof args => {
      if (args === undefined) {
        makeArgs(isCreateStateFn(initialValue) ? initialValue() : initialValue);
      }

      return args;
    },
  };
});
