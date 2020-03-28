import { VoidFunction } from './types';
import { HOOK, EFFECTS } from './symbols';
import { Hook } from './hook';
import { setCurrent, clear } from './stateInterface';

export interface Callable {
  call: (state: State) => void;
}

export class State<H = unknown> {
  update: VoidFunction;

  host: H;

  [HOOK]: Map<number, Hook>;

  [EFFECTS]: Callable[];

  constructor(update: VoidFunction, host: H) {
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
