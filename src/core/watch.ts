// Copyright 2020 the RaModel authors. All rights reserved. MIT license.

import memoizeOne from 'memoize-one';
import { EVENT_EMITTER } from './symbols';
import { EVENT_CHANGE } from './events';
import { Lens, ExtractResultFromLens } from './lens';
import { BaseModel } from './types';

type UnsubscribeFn = () => void;

type L<R> = Lens<R>;

export function watch<
  Result,
  Lenses extends Record<string, Lens<any>>,
  Results = { [key in keyof Lenses]: ExtractResultFromLens<Lenses[key]> }
>(lenses: Lenses, handler: (results: Results) => unknown): UnsubscribeFn;
export function watch<Result>(lens: L<Result>, handler: (v1: Result) => unknown): UnsubscribeFn;
export function watch<R1>(lenses: [L<R1>], handler: (v1: R1) => unknown): UnsubscribeFn;
export function watch<R1, R2>(lenses: [L<R1>, L<R2>], handler: (v1: R1, v2: R2) => unknown): UnsubscribeFn;
export function watch<R1, R2, R3>(
  lenses: [L<R1>, L<R2>, L<R3>],
  handler: (v1: R1, v2: R2, v3: R3) => unknown,
): UnsubscribeFn;
export function watch<R1, R2, R3, R4>(
  lenses: [L<R1>, L<R2>, L<R3>, L<R4>],
  handler: (v1: R1, v2: R2, v3: R3, v4: R4) => unknown,
): UnsubscribeFn;
export function watch<R1, R2, R3, R4, R5>(
  lenses: [L<R1>, L<R2>, L<R3>, L<R4>, L<R5>],
  handler: (v1: R1, v2: R2, v3: R3, v4: R4, v5: R5) => unknown,
): UnsubscribeFn;
export function watch<R1, R2, R3, R4, R5, R6>(
  lenses: [L<R1>, L<R2>, L<R3>, L<R4>, L<R5>, L<R6>],
  handler: (v1: R1, v2: R2, v3: R3, v4: R4, v5: R5, v6: R6) => unknown,
): UnsubscribeFn;
export function watch<R1, R2, R3, R4, R5, R6, R7>(
  lenses: [L<R1>, L<R2>, L<R3>, L<R4>, L<R5>, L<R6>, L<R7>],
  handler: (v1: R1, v2: R2, v3: R3, v4: R4, v5: R5, v6: R6, v7: R7) => unknown,
): UnsubscribeFn;
export function watch<R1, R2, R3, R4, R5, R6, R7, R8>(
  lenses: [L<R1>, L<R2>, L<R3>, L<R4>, L<R5>, L<R6>, L<R7>, L<R8>],
  handler: (v1: R1, v2: R2, v3: R3, v4: R4, v5: R5, v6: R6, v7: R7, v8: R8) => unknown,
): UnsubscribeFn;
export function watch<R1, R2, R3, R4, R5, R6, R7, R8, R9>(
  lenses: [L<R1>, L<R2>, L<R3>, L<R4>, L<R5>, L<R6>, L<R7>, L<R8>, L<R9>],
  handler: (v1: R1, v2: R2, v3: R3, v4: R4, v5: R5, v6: R6, v7: R7, v8: R8, v9: R9) => unknown,
): UnsubscribeFn;
export function watch<R1, R2, R3, R4, R5, R6, R7, R8, R9, R10>(
  lenses: [L<R1>, L<R2>, L<R3>, L<R4>, L<R5>, L<R6>, L<R7>, L<R8>, L<R9>, L<R10>],
  handler: (v1: R1, v2: R2, v3: R3, v4: R4, v5: R5, v6: R6, v7: R7, v8: R8, v9: R9, v10: R10) => unknown,
): UnsubscribeFn;

export function watch<R>(
  lenses: Lens<R> | Lens<R>[] | Record<string, Lens<R>>,
  handler: (...observable: (R | Record<string, R>)[]) => unknown,
): UnsubscribeFn {
  const memoizedHandler = memoizeOne(handler);
  let unsubscribes: UnsubscribeFn[] = [];
  let unloaded = false;

  let lastTick: Promise<void> | null = null;
  const debounceTick = () => {
    if (lastTick) return;
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    lastTick = Promise.resolve().then(tick);
  };

  const subscribeModels = (models: BaseModel[]) =>
    models.map(model => model[EVENT_EMITTER].on(EVENT_CHANGE, debounceTick));

  const tick = () => {
    lastTick = null;
    unsubscribes.forEach(fn => fn());

    if (unloaded) return;

    if (Array.isArray(lenses)) {
      const lensState = lenses.map(update => update());
      const results: R[] = lensState.map(i => i.result);
      const models = Array.from(new Set(lensState.flatMap(i => i.models)));

      unsubscribes = subscribeModels(models);
      memoizedHandler(...results);
    } else if (typeof lenses === 'function') {
      const { result, models } = lenses();

      unsubscribes = subscribeModels(models);
      memoizedHandler(result);
    } else {
      const lensState = Object.entries(lenses).map(
        ([key, update]) => [key, update()] as [string, ReturnType<typeof update>],
      );
      const results = lensState.reduce((acc, [key, i]) => {
        acc[key] = i.result;
        return acc;
      }, {} as Record<string, R>);
      const models = Array.from(new Set(lensState.flatMap(([_key, i]) => i.models)));

      unsubscribes = subscribeModels(models);
      memoizedHandler(results);
    }
  };

  tick();

  return () => {
    unloaded = true;
    unsubscribes.forEach(fn => fn());
  };
}
