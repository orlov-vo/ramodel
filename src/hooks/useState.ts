// Copyright 2020 the RaModel authors. All rights reserved. MIT license.
// Copyright 2018-2019 Matthew Phillips. All rights reserved. BSD 2-Clause license.

import { hook, Hook } from '../core/hook';
import { State } from '../core/state';

type NewState<T> = T | ((previousState: T) => T);
type StateUpdater<T> = (value: NewState<T>) => void;

export const useState = hook(
  class<T> extends Hook {
    args!: readonly [T, StateUpdater<T>];

    constructor(id: number, state: State, initialValue: T) {
      super(id, state);
      this.updater = this.updater.bind(this);

      this.makeArgs(typeof initialValue === 'function' ? initialValue() : initialValue);
    }

    update(): readonly [T, StateUpdater<T>] {
      return this.args;
    }

    updater(value: NewState<T>): void {
      const [previousValue] = this.args;
      const newValue = typeof value === 'function' ? (value as (previousState?: T) => T)(previousValue) : value;

      if (newValue !== previousValue) {
        this.makeArgs(newValue);
        this.state.update();
      }
    }

    makeArgs(value: T): void {
      this.args = Object.freeze([value, this.updater] as const);
    }
  },
);
