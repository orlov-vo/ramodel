// Copyright 2020 the RaModel authors. All rights reserved. MIT license.

import memoizeOne from 'memoize-one';
import { BaseModel, VoidFunction } from './types';
import { get, Accessor } from './get';
import { isModel } from './isModel';
import { createEventEmitter } from './eventEmitter';
import { watch } from './watch';

export interface Lens<R> {
  _brand: 'lens';
  (): { models: BaseModel[]; result: R };
  subscribe: (subscribeHandler: (value: R) => void) => VoidFunction;
  toString: () => string;
}
export type ExtractResultFromLens<TLens> = TLens extends Lens<infer R> ? R : never;

type Handler<M> = (model: M, key: string | number | symbol, value: unknown) => unknown;

const EVENT_NAME = 'get';
const eventEmitter = createEventEmitter();

function subscribe<M extends BaseModel>(handler: Handler<M>): () => void {
  return eventEmitter.on(EVENT_NAME, handler);
}

export function notify<M extends BaseModel>(model: M, key: string | number | symbol, value: unknown) {
  eventEmitter.emit(EVENT_NAME, model, key, value);
}

export function isLens(value: unknown): value is Lens<unknown> {
  // eslint-disable-next-line no-underscore-dangle
  return typeof value === 'function' && (value as Lens<unknown>)._brand === 'lens';
}

export function createLens<T, R>(value: T, selector: Accessor<T, R>): Lens<R> {
  const lens = function useLens() {
    const models = new Set<BaseModel>();

    if (isModel(value)) {
      models.add(value);
    }

    const unsubscribe = subscribe(model => models.add(model));

    // @ts-ignore
    const result = get(value, selector) as R;

    unsubscribe();

    return { models: Array.from(models), result };
  };

  // eslint-disable-next-line no-underscore-dangle
  lens._brand = 'lens' as const;
  lens.toString = () => String(lens().result);
  lens.subscribe = (subscribeHandler: (value: R) => void): VoidFunction => watch(lens, subscribeHandler);

  return lens;
}

type L<R> = Lens<R>;

export function combineLenses<
  Result,
  Lenses extends Record<string, L<any>>,
  Results = { [key in keyof Lenses]: ExtractResultFromLens<Lenses[key]> }
>(lenses: Lenses, handler: (results: Results) => Result): L<Result>;
export function combineLenses<Result, R1>(lenses: [L<R1>], handler: (v1: R1) => Result): L<Result>;
export function combineLenses<Result, R1, R2>(lenses: [L<R1>, L<R2>], handler: (v1: R1, v2: R2) => Result): L<Result>;
export function combineLenses<Result, R1, R2, R3>(
  lenses: [L<R1>, L<R2>, L<R3>],
  handler: (v1: R1, v2: R2, v3: R3) => Result,
): L<Result>;
export function combineLenses<Result, R1, R2, R3, R4>(
  lenses: [L<R1>, L<R2>, L<R3>, L<R4>],
  handler: (v1: R1, v2: R2, v3: R3, v4: R4) => Result,
): L<Result>;
export function combineLenses<Result, R1, R2, R3, R4, R5>(
  lenses: [L<R1>, L<R2>, L<R3>, L<R4>, L<R5>],
  handler: (v1: R1, v2: R2, v3: R3, v4: R4, v5: R5) => Result,
): L<Result>;
export function combineLenses<Result, R1, R2, R3, R4, R5, R6>(
  lenses: [L<R1>, L<R2>, L<R3>, L<R4>, L<R5>, L<R6>],
  handler: (v1: R1, v2: R2, v3: R3, v4: R4, v5: R5, v6: R6) => Result,
): L<Result>;
export function combineLenses<Result, R1, R2, R3, R4, R5, R6, R7>(
  lenses: [L<R1>, L<R2>, L<R3>, L<R4>, L<R5>, L<R6>, L<R7>],
  handler: (v1: R1, v2: R2, v3: R3, v4: R4, v5: R5, v6: R6, v7: R7) => Result,
): L<Result>;
export function combineLenses<Result, R1, R2, R3, R4, R5, R6, R7, R8>(
  lenses: [L<R1>, L<R2>, L<R3>, L<R4>, L<R5>, L<R6>, L<R7>, L<R8>],
  handler: (v1: R1, v2: R2, v3: R3, v4: R4, v5: R5, v6: R6, v7: R7, v8: R8) => Result,
): L<Result>;
export function combineLenses<Result, R1, R2, R3, R4, R5, R6, R7, R8, R9>(
  lenses: [L<R1>, L<R2>, L<R3>, L<R4>, L<R5>, L<R6>, L<R7>, L<R8>, L<R9>],
  handler: (v1: R1, v2: R2, v3: R3, v4: R4, v5: R5, v6: R6, v7: R7, v8: R8, v9: R9) => Result,
): L<Result>;
export function combineLenses<Result, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10>(
  lenses: [L<R1>, L<R2>, L<R3>, L<R4>, L<R5>, L<R6>, L<R7>, L<R8>, L<R9>, L<R10>],
  handler: (v1: R1, v2: R2, v3: R3, v4: R4, v5: R5, v6: R6, v7: R7, v8: R8, v9: R9, v10: R10) => Result,
): L<Result>;

export function combineLenses<Result, R>(
  lenses: Lens<R>[] | Record<string, Lens<R>>,
  handler: (...observable: (R | Record<string, R>)[]) => Result,
): Lens<Result> {
  const memoizedHandler = memoizeOne(handler);

  const lens = function useCombinedLens() {
    if (Array.isArray(lenses)) {
      const lenseStates = lenses.map(update => update());
      const results: R[] = lenseStates.map(i => i.result);
      const models = Array.from(new Set(lenseStates.flatMap(i => i.models)));

      return { models, result: memoizedHandler(...results) };
    }

    const lenseStates = Object.entries(lenses).map(
      ([key, update]) => [key, update()] as [string, ReturnType<typeof update>],
    );
    const results = lenseStates.reduce((acc, [key, i]) => {
      acc[key] = i.result;
      return acc;
    }, {} as Record<string, R>);
    const models = Array.from(new Set(lenseStates.flatMap(([_key, i]) => i.models)));

    return { models, result: memoizedHandler(results) };
  };

  // eslint-disable-next-line no-underscore-dangle
  lens._brand = 'lens' as const;
  lens.toString = () => String(lens().result);
  lens.subscribe = (subscribeHandler: (value: Result) => void): VoidFunction => watch(lens, subscribeHandler);

  return lens;
}
