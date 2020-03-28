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
  let models: Set<BaseModel>;

  return () => {
    models = new Set();

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
