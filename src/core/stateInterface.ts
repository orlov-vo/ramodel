// Copyright 2020 the RaModel authors. All rights reserved. MIT license.

import { State } from './state';

type HookState = {
  id: number;
  state: State;
  previous: HookState | null;
};

let current: HookState | null = null;

export function setCurrent(state: State): void {
  const previous = current;
  current = { id: 0, state, previous };
}

export function clear(): void {
  if (current == null) {
    throw new Error("Couldn't clear hook state if you didn't call `setCurrent` before");
  }

  current = current.previous;
}

export function notify(): { id: number; state: State } {
  if (current == null) {
    throw new Error("Couldn't notify hook state if you didn't call `setCurrent` before");
  }

  current.id += 1;

  return current;
}
