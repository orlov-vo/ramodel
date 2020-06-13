// Copyright 2020 the RaModel authors. All rights reserved. MIT license.
// Copyright 2018-2019 Matthew Phillips. All rights reserved. BSD 2-Clause license.

import { createHook } from '../core/hook';
import { State } from '../core/state';

type Reducer<S, A> = (state: S, action: A) => S;

export const useReducer = createHook(<S, I, A>(state: State) => {
  let reducer: Reducer<S, A>;
  let currentState: S;
  let args: readonly [S, (action: A) => void];

  const makeArgs = (value: S): void => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    args = Object.freeze([value, dispatch] as const);
  };

  const dispatch = async (action: A): Promise<void> => {
    currentState = reducer(currentState, action);
    makeArgs(currentState);
    await state.update();
  };

  return {
    update: (newReducer: Reducer<S, A>, initialState: I, init?: (_: I) => S): typeof args => {
      if (args === undefined) {
        currentState = init !== undefined ? init(initialState) : <S>(<any>initialState);
        makeArgs(currentState);
      }

      reducer = newReducer;
      return args;
    },
  };
});
