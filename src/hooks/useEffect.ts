// Copyright 2020 the RaModel authors. All rights reserved. MIT license.
// Copyright 2018-2019 Matthew Phillips. All rights reserved. BSD 2-Clause license.

import { VoidFunction } from '../core/types';
import { EFFECTS } from '../core/symbols';
import { createHook } from '../core/hook';
import { State } from '../core/state';
import { hasChanged } from './hasChanged';

type Effect = (this: State) => void | VoidFunction;

type EffectState = {
  callback: Effect;
  teardown: VoidFunction | void;
  lastValues?: unknown[];
  values?: unknown[];
};

export const useEffect = createHook((state: State) => {
  const effectState = {} as EffectState;

  const teardown = (): void => {
    if (typeof effectState.teardown !== 'function') return;
    effectState.teardown();
  };

  const run = (): void => {
    teardown();
    effectState.teardown = effectState.callback.call(state);
  };

  const update = (callback: Effect, values?: unknown[]): void => {
    effectState.callback = callback;
    effectState.lastValues = effectState.values;
    effectState.values = values;
  };

  state[EFFECTS].push(() => {
    if (!hasChanged(effectState.values, effectState.lastValues)) return;
    run();
  });

  return { update, teardown };
});
