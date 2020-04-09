import { HOOK } from './symbols';
import { notify } from './stateInterface';
import { State } from './state';

export abstract class Hook<P extends unknown[] = unknown[], R = unknown, H = unknown> {
  id: number;

  state: State<H>;

  constructor(id: number, state: State<H>) {
    this.id = id;
    this.state = state;
  }

  abstract update(...args: P): R;

  teardown?(): void;
}

interface CustomHook<P extends unknown[] = unknown[], R = unknown, H = unknown> {
  new (id: number, state: State<H>, ...args: P): Hook<P, R, H>;
}

function use<P extends unknown[], R, H = unknown>(HookClass: CustomHook<P, R, H>, ...args: P): R {
  const { id, state } = notify();

  if (!state) {
    throw new Error('Use hooks only inside models');
  }

  const hooks = state[HOOK];
  let currentHook = hooks.get(id) as Hook<P, R, H> | undefined;
  if (!currentHook) {
    currentHook = new HookClass(id, state as State<H>, ...args);
    hooks.set(id, currentHook);
  }

  return currentHook.update(...args);
}

export function hook<P extends unknown[], R, H = unknown>(HookClass: CustomHook<P, R, H>): (...args: P) => R {
  return use.bind<null, CustomHook<P, R, H>, P, R>(null, HookClass);
}
