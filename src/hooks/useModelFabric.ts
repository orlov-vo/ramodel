// Copyright 2020 the RaModel authors. All rights reserved. MIT license.

import type { ModelClass } from '../core/createModel';
import type { Context } from '../core/createContext';
import { update } from '../core/update';
import { destroy, onDestroy } from '../core/destroy';
import { useEffect } from './useEffect';
import { useCallback } from './useCallback';
import { useRef } from './useRef';

type UseModelOptions<Input> = {
  input?: Input;
  contexts?: Array<[Context<any>, any]>;
};

export function useModelFabric<Input extends object, Public extends object>(
  Model: ModelClass<Input, Public>,
  options: UseModelOptions<Input> = {},
): (input: Input) => readonly [Public, (newInput: Input) => void] {
  const { contexts = [] } = options;

  const instances = useRef(new Map());

  // Create instance with contexts
  const createInstance = useCallback(
    (input: Input) => {
      const create = contexts.reduce(
        (acc, [context, value]) => () => context.withValue(value, acc),
        () => new Model({ ...options.input, ...input }),
      );

      const instance = create();

      instances.current.set(instance, input);

      return [
        instance,
        (newInput: Input) => {
          update(instance, newInput);
          instances.current.set(instance, newInput);
        },
      ] as const;
    },
    [contexts, options.input],
  );

  // Update instance's input on every change
  useEffect(() => {
    Array.from(instances.current.entries()).forEach(([instance, input]) => {
      update(instance, { ...options.input, ...input });
    });
  }, [options.input]);

  // Update instance's contexts on every change
  const oldContext = useRef([] as typeof contexts);
  useEffect(() => {
    const removedContexts = oldContext.current
      .filter(([contextA]) => !contexts.some(([contextB]) => contextA === contextB))
      .map(([context]) => context);

    Array.from(instances.current.keys()).forEach(instance => {
      removedContexts.forEach(context => context.removeFrom(instance));

      contexts.forEach(([context, value]) => {
        context.updateValue(instance, value);
      });
    });

    oldContext.current = contexts;
  });

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
