import { HOOK } from './symbols';
import { current, notify } from './interface';
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
  const id = notify();
  const hooks = current![HOOK];
  let currentHook = hooks.get(id) as Hook<P, R, H> | undefined;
  if (!currentHook) {
    currentHook = new HookClass(id, current as State<H>, ...args);
    hooks.set(id, currentHook);
  }

  return currentHook.update(...args);
}

export function hook<P extends unknown[], R, H = unknown>(HookClass: CustomHook<P, R, H>): (...args: P) => R {
  return use.bind<null, CustomHook<P, R, H>, P, R>(null, HookClass);
}
