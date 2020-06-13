// Copyright 2020 the RaModel authors. All rights reserved. MIT license.
// Copyright 2018-2019 Matthew Phillips. All rights reserved. BSD 2-Clause license.

import { HOOK } from './symbols';
import { notify } from './stateInterface';
import { State } from './state';

export type Hook<P extends unknown[], R = unknown> = {
  update: (...args: P) => R;
  teardown?: () => void;
};

type HookCreator<P extends unknown[], R = unknown, H = unknown> = (state: State<H>) => Hook<P, R>;

export function createHook<P extends unknown[], R, H = unknown>(hookCreator: HookCreator<P, R, H>): (...args: P) => R {
  return (...args: P): R => {
    const { id, state } = notify();

    if (!state) {
      throw new Error('Use hooks only inside models');
    }

    const hooks = state[HOOK] as Map<number, Hook<P, R>>;
    let currentHook = hooks.get(id);
    if (!currentHook) {
      currentHook = hookCreator(state as State<H>);
      hooks.set(id, currentHook);
    }

    return currentHook.update(...args);
  };
}
