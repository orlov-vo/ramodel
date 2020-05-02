// Copyright 2020 the RaModel authors. All rights reserved. MIT license.

import { State } from './state';

const current = {
  id: 0,
  state: null as State | null,
};

export function setCurrent(state: State): void {
  current.state = state;
}

export function clear(): void {
  current.id = 0;
  current.state = null;
}

export function notify(): typeof current {
  const { id } = current;
  current.id += 1;

  return { ...current, id };
}
