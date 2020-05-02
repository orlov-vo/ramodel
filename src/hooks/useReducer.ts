// Copyright 2020 the RaModel authors. All rights reserved. MIT license.
// Copyright 2018-2019 Matthew Phillips. All rights reserved. BSD 2-Clause license.

import { hook, Hook } from '../core/hook';
import { State } from '../core/state';

type Reducer<S, A> = (state: S, action: A) => S;

export const useReducer = hook(
  class<S, I, A> extends Hook {
    reducer!: Reducer<S, A>;

    currentState: S;

    constructor(id: number, state: State, _: Reducer<S, A>, initialState: I, init?: (_: I) => S) {
      super(id, state);
      this.dispatch = this.dispatch.bind(this);
      this.currentState = init !== undefined ? init(initialState) : <S>(<any>initialState);
    }

    update(reducer: Reducer<S, A>): readonly [S, (action: A) => void] {
      this.reducer = reducer;
      return [this.currentState, this.dispatch];
    }

    dispatch(action: A): void {
      this.currentState = this.reducer(this.currentState, action);
      this.state.update();
    }
  },
);
