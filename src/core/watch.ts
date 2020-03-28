import { EVENT_EMITTER } from './symbols';
import { Lense } from './lense';

const EVENT_CHANGE = 'change';

type UnsubscribeFn = () => void;

export function watch<R1>(lenses: [Lense<R1>], handler: (v1: R1) => void): UnsubscribeFn;
export function watch<R1, R2>(lenses: [Lense<R1>, Lense<R2>], handler: (v1: R1, v2: R2) => void): UnsubscribeFn;
export function watch<R1, R2, R3>(
  lenses: [Lense<R1>, Lense<R2>, Lense<R3>],
  handler: (v1: R1, v2: R2, v3: R3) => void,
): UnsubscribeFn;
export function watch<R1, R2, R3, R4>(
  lenses: [Lense<R1>, Lense<R2>, Lense<R3>, Lense<R4>],
  handler: (v1: R1, v2: R2, v3: R3, v4: R4) => void,
): UnsubscribeFn;
export function watch<R1, R2, R3, R4, R5>(
  lenses: [Lense<R1>, Lense<R2>, Lense<R3>, Lense<R4>, Lense<R5>],
  handler: (v1: R1, v2: R2, v3: R3, v4: R4, v5: R5) => void,
): UnsubscribeFn;

export function watch<R>(lenses: Lense<R>[], handler: (...observable: R[]) => void): UnsubscribeFn {
  let unsubscribes: UnsubscribeFn[] = [];

  const tick = () => {
    unsubscribes.forEach(fn => fn());

    const lenseStates = lenses.map(update => update());
    const results: R[] = lenseStates.map(i => i.result);
    const models = Array.from(new Set(lenseStates.flatMap(i => i.models)));

    unsubscribes = models.map(model => model[EVENT_EMITTER].on(EVENT_CHANGE, () => tick()));

    handler(...results);
  };

  tick();

  return () => {
    unsubscribes.forEach(fn => fn());
  };
}
