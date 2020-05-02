// Copyright 2020 the RaModel authors. All rights reserved. MIT license.

import { BaseModel } from './types';
import { onInit } from './createModel';
import { SCHEDULER, CONTEXTS, CHILDREN } from './symbols';
import { Scheduler } from './scheduler';

export type Context<T> = {
  withValue<R>(value: T, fn: () => R): R;
  updateValue(instance: BaseModel, value: T): void;
  removeFrom(instance: BaseModel): void;
  use(instance: BaseModel): void;
  defaultValue: T;
};

export function createContext<T>(defaultValue: T): Context<T> {
  // Here we store ref schedulers because reference to instances different
  // because in update we could recive refernce to proxy
  const usedIn: WeakSet<Scheduler<any, any, any>> = new WeakSet();

  const deepSchedulerUpdate = (instance: BaseModel) => {
    instance[CHILDREN].forEach(child => deepSchedulerUpdate(child));

    const scheduler = instance[SCHEDULER];

    if (scheduler != null && usedIn.has(scheduler)) {
      scheduler.update();
    }
  };

  const context: Context<T> = {
    defaultValue,
    withValue: <R>(value: T, fn: () => R): R => {
      const unsubscribe = onInit(instance => {
        instance[CONTEXTS].set(context, value);
      });

      const result = fn();
      unsubscribe();

      return result;
    },
    updateValue: (instance: BaseModel, value: T): void => {
      instance[CONTEXTS].set(context, value);
      deepSchedulerUpdate(instance);
    },
    removeFrom: (instance: BaseModel): void => {
      instance[CONTEXTS].delete(context);
      deepSchedulerUpdate(instance);
    },
    use: (instance: BaseModel): void => {
      const scheduler = instance[SCHEDULER];

      if (scheduler == null) {
        throw new Error("Couldn't use context for destroyed instance");
      }

      usedIn.add(scheduler);
    },
  };

  return context;
}
