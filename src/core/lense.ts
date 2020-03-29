import memoizeOne from 'memoize-one';
import { BaseModel } from './types';
import { get, Accessor } from './get';
import { isModel } from './isModel';
import { createEventEmitter } from './eventEmitter';

export type Lense<R> = () => { models: BaseModel[]; result: R };
type Handler<M> = (model: M, key: string | number | symbol, value: unknown) => unknown;

const EVENT_NAME = 'get';
const eventEmitter = createEventEmitter();

function subscribe<M extends BaseModel>(handler: Handler<M>): () => void {
  return eventEmitter.on(EVENT_NAME, handler);
}

export function notify<M extends BaseModel>(model: M, key: string | number | symbol, value: unknown) {
  eventEmitter.emit(EVENT_NAME, model, key, value);
}

export function makeLense<T extends BaseModel, R>(rootModel: T, selector: Accessor<T, R>): Lense<R> {
  return function useLense() {
    const models = new Set<BaseModel>();

    if (isModel(rootModel)) {
      models.add(rootModel);
    }

    const unsubscribe = subscribe(model => models.add(model));

    // @ts-ignore
    const result = get(rootModel, selector) as R;

    unsubscribe();

    return { models: Array.from(models), result };
  };
}

type L<R> = Lense<R>;

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

export function combineLenses<Result, R>(lenses: Lense<R>[], handler: (...observable: R[]) => Result): Lense<Result> {
  const memoizedHandler = memoizeOne(handler);

  return function useCombinedLense() {
    const lenseStates = lenses.map(update => update());
    const results: R[] = lenseStates.map(i => i.result);
    const models = Array.from(new Set(lenseStates.flatMap(i => i.models)));

    return { models, result: memoizedHandler(...results) };
  };
}
