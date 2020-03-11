import { hook, Hook } from '../core/hook';
import { State } from '../core/state';

export const useMemo = hook(
  class Memo<T> extends Hook {
    value: T;

    values: unknown[];

    constructor(id: number, state: State, fn: () => T, values: unknown[]) {
      super(id, state);
      this.value = fn();
      this.values = values;
    }

    update(fn: () => T, values: unknown[]): T {
      if (this.hasChanged(values)) {
        this.values = values;
        this.value = fn();
      }
      return this.value;
    }

    hasChanged(values: unknown[] = []): boolean {
      return values.some((value, i) => this.values[i] !== value);
    }
  },
);
