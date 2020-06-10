// Copyright 2020 the RaModel authors. All rights reserved. MIT license.
// Copyright 2018-2019 Matthew Phillips. All rights reserved. BSD 2-Clause license.

import { VoidFunction } from '../core/types';
import { EFFECTS } from '../core/symbols';
import { Hook, hook } from '../core/hook';
import { State } from '../core/state';
import { hasChanged } from './hasChanged';

type Effect = (this: State) => void | VoidFunction;

export const useEffect = hook(
  class extends Hook {
    callback!: Effect;

    lastValues?: unknown[];

    values?: unknown[];

    _teardown!: VoidFunction | void;

    constructor(id: number, state: State, _effect: Effect, _values?: unknown[]) {
      super(id, state);
      state[EFFECTS].push(this);
    }

    update(callback: Effect, values?: unknown[]): void {
      this.callback = callback;
      this.lastValues = this.values;
      this.values = values;
    }

    call(): void {
      if (!hasChanged(this.values, this.lastValues)) return;
      this.run();
    }

    run(): void {
      this.teardown();
      this._teardown = this.callback.call(this.state);
    }

    teardown(): void {
      if (typeof this._teardown !== 'function') return;
      this._teardown();
    }
  },
);
