import memoizeOne from 'memoize-one';
import { EVENT_EMITTER } from './symbols';
import { EVENT_CHANGE } from './events';
import { Lense } from './lense';

type UnsubscribeFn = () => void;

type L<R> = Lense<R>;

export function watch<R1>(lenses: [L<R1>], handler: (v1: R1) => void): UnsubscribeFn;
export function watch<R1, R2>(lenses: [L<R1>, L<R2>], handler: (v1: R1, v2: R2) => void): UnsubscribeFn;
export function watch<R1, R2, R3>(
  lenses: [L<R1>, L<R2>, L<R3>],
  handler: (v1: R1, v2: R2, v3: R3) => void,
): UnsubscribeFn;
export function watch<R1, R2, R3, R4>(
  lenses: [L<R1>, L<R2>, L<R3>, L<R4>],
  handler: (v1: R1, v2: R2, v3: R3, v4: R4) => void,
): UnsubscribeFn;
export function watch<R1, R2, R3, R4, R5>(
  lenses: [L<R1>, L<R2>, L<R3>, L<R4>, L<R5>],
  handler: (v1: R1, v2: R2, v3: R3, v4: R4, v5: R5) => void,
): UnsubscribeFn;
export function watch<R1, R2, R3, R4, R5, R6>(
  lenses: [L<R1>, L<R2>, L<R3>, L<R4>, L<R5>, L<R6>],
  handler: (v1: R1, v2: R2, v3: R3, v4: R4, v5: R5, v6: R6) => void,
): UnsubscribeFn;
export function watch<R1, R2, R3, R4, R5, R6, R7>(
  lenses: [L<R1>, L<R2>, L<R3>, L<R4>, L<R5>, L<R6>, L<R7>],
  handler: (v1: R1, v2: R2, v3: R3, v4: R4, v5: R5, v6: R6, v7: R7) => void,
): UnsubscribeFn;
export function watch<R1, R2, R3, R4, R5, R6, R7, R8>(
  lenses: [L<R1>, L<R2>, L<R3>, L<R4>, L<R5>, L<R6>, L<R7>, L<R8>],
  handler: (v1: R1, v2: R2, v3: R3, v4: R4, v5: R5, v6: R6, v7: R7, v8: R8) => void,
): UnsubscribeFn;
export function watch<R1, R2, R3, R4, R5, R6, R7, R8, R9>(
  lenses: [L<R1>, L<R2>, L<R3>, L<R4>, L<R5>, L<R6>, L<R7>, L<R8>, L<R9>],
  handler: (v1: R1, v2: R2, v3: R3, v4: R4, v5: R5, v6: R6, v7: R7, v8: R8, v9: R9) => void,
): UnsubscribeFn;
export function watch<R1, R2, R3, R4, R5, R6, R7, R8, R9, R10>(
  lenses: [L<R1>, L<R2>, L<R3>, L<R4>, L<R5>, L<R6>, L<R7>, L<R8>, L<R9>, L<R10>],
  handler: (v1: R1, v2: R2, v3: R3, v4: R4, v5: R5, v6: R6, v7: R7, v8: R8, v9: R9, v10: R10) => void,
): UnsubscribeFn;

export function watch<R>(lenses: Lense<R>[], handler: (...observable: R[]) => void): UnsubscribeFn {
  const memoizedHandler = memoizeOne(handler);
  let unsubscribes: UnsubscribeFn[] = [];

  const tick = () => {
    unsubscribes.forEach(fn => fn());

    const lenseStates = lenses.map(update => update());
    const results: R[] = lenseStates.map(i => i.result);
    const models = Array.from(new Set(lenseStates.flatMap(i => i.models)));

    unsubscribes = models.map(model => model[EVENT_EMITTER].on(EVENT_CHANGE, () => tick()));

    memoizedHandler(...results);
  };

  tick();

  return () => {
    unsubscribes.forEach(fn => fn());
  };
}
