// Copyright 2020 the RaModel authors. All rights reserved. MIT license.

import { createHook } from '../core/hook';
import { State } from '../core/state';
import { Context } from '../core/createContext';
import { CONTEXTS, PARENT } from '../core/symbols';
import { BaseModel } from '../core/types';

export const useContext = createHook(<T>(state: State<BaseModel>) => {
  let usedContext: Context<T> | null = null;

  return {
    update: (context: Context<T>) => {
      let instance: BaseModel | null = state.host;

      while (instance) {
        const contexts = instance[CONTEXTS];
        if (contexts.has(context)) {
          return contexts.get(context) as T;
        }

        instance = instance[PARENT];
      }

      return context.defaultValue;
    },
  };
});
