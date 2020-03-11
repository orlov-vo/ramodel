import { VoidFunction } from '../core/types';
import { EFFECTS } from '../core/symbols';
import { Hook, hook } from '../core/hook';
import { State } from '../core/state';

type Effect = (this: State) => void | VoidFunction;

export const useEffect = hook(
  class extends Hook {
    callback!: Effect;

    lastValues?: unknown[];

    values?: unknown[];

    _teardown!: VoidFunction | void;

    constructor(id: number, state: State, _effect: Effect, _values: unknown[]) {
      super(id, state);
      state[EFFECTS].push(this);
    }

    update(callback: Effect, values?: unknown[]): void {
      this.callback = callback;
      this.lastValues = this.values;
      this.values = values;
    }

    call(): void {
      if (!this.values || this.hasChanged()) {
        this.run();
      }
    }

    run(): void {
      this.teardown();
      this._teardown = this.callback.call(this.state);
    }

    teardown(): void {
      if (typeof this._teardown === 'function') {
        this._teardown();
      }
    }

    hasChanged(): boolean {
      return !this.lastValues || this.values!.some((value, i) => this.lastValues![i] !== value);
    }
  },
);
