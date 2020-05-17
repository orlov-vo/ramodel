// Copyright 2020 the RaModel authors. All rights reserved. MIT license.
// Copyright 2018-2019 Matthew Phillips. All rights reserved. BSD 2-Clause license.

import { AsyncVoidFunction } from './types';
import { HOOK, EFFECTS } from './symbols';
import { Hook } from './hook';
import { setCurrent, clear } from './stateInterface';

export interface Callable {
  call: (state: State) => void;
}

export class State<H = unknown> {
  update: AsyncVoidFunction;

  host: H;

  [HOOK]: Map<number, Hook>;

  [EFFECTS]: Callable[];

  constructor(update: AsyncVoidFunction, host: H) {
    this[HOOK] = new Map();
    this[EFFECTS] = [];

    this.update = update;
    this.host = host;
  }

  run<T>(cb: () => T): T {
    setCurrent(this);
    const res = cb();
    clear();
    return res;
  }

  runEffects(): void {
    const effects = this[EFFECTS];

    setCurrent(this);
    effects.forEach(effect => effect.call(this));
    clear();
  }

  teardown(): void {
    const hooks = this[HOOK];

    hooks.forEach(hook => {
      if (typeof hook.teardown === 'function') {
        hook.teardown();
      }
    });
  }
}
