// Copyright 2020 the RaModel authors. All rights reserved. MIT license.

import type { ModelClass } from '../core/createModel';
import type { BaseModel } from '../core/types';
import type { Context } from '../core/createContext';
import { getModelInExecuting, setModelInExecuting } from '../core/createModel';
import { destroy, onDestroy } from '../core/destroy';
import { isModel } from '../core/mod';
import { useEffect } from './useEffect';
import { useCallback } from './useCallback';
import { useRef } from './useRef';

type UseModelOptions = {
  contexts?: Array<[Context<any>, any]>;
};

export function useModelFabric<Input extends object, Public extends object>(
  Model: ModelClass<Input, Public>,
  options: UseModelOptions = {},
): (input?: Input) => Public {
  const { contexts = [] } = options;

  const instances = useRef(new Set<BaseModel>());
  const parent = getModelInExecuting();

  // Create instance with contexts
  const createInstance = useCallback((input = {} as Input) => {
    const create = contexts.reduce(
      (acc, [context, value]) => () => context.withValue(value, acc),
      () => new Model(input),
    );

    const instance = setModelInExecuting(parent, create);
    if (!isModel(instance)) {
      throw new Error('It seems you pass invalid constructor');
    }

    instances.current.add(instance);

    return instance;
  }, contexts.flat());

  // Update instance's contexts on every change in them
  const oldContext = useRef([] as typeof contexts);
  useEffect(() => {
    const removedContexts = oldContext.current
      .map(([context]) => context)
      .filter(contextA => !contexts.some(([contextB]) => contextA === contextB));

    Array.from(instances.current.keys()).forEach(instance => {
      removedContexts.forEach(context => context.removeFrom(instance));

      contexts.forEach(([context, value]) => {
        context.updateValue(instance, value);
      });
    });

    oldContext.current = contexts;
  }, contexts.flat());

  // Destroy instance on teardown
  useEffect(() => {
    const unsubscribe = onDestroy('model', destroyedInstance => {
      instances.current.delete(destroyedInstance);
    });

    return () => {
      unsubscribe();
      destroy(...Array.from(instances.current.keys()));
      instances.current.clear();
    };
  }, []);

  return createInstance;
}
