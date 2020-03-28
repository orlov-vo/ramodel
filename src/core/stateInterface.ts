import { State } from './state';

export let current: State | null; // eslint-disable-line import/no-mutable-exports
let currentId = 0;

export function setCurrent(state: State): void {
  current = state;
}

export function clear(): void {
  current = null;
  currentId = 0;
}

export function notify(): number {
  const result = currentId;
  currentId += 1;

  return result;
}
