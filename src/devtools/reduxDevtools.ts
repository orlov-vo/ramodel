// Copyright 2020 the RaModel authors. All rights reserved. MIT license.

import cloneDeep from 'lodash.clonedeep';
import { createLens, watch } from '../core/mod';

type Options = {
  name: string;
};

const DEFAULT_OPTIONS: Options = {
  name: '',
};

export function connectReduxDevtools(root: unknown, options: Partial<Options> = {}) {
  // eslint-disable-next-line no-underscore-dangle
  const devTools = (globalThis as any).__REDUX_DEVTOOLS_EXTENSION__;
  if (!devTools) return () => {};

  const usedOptions = { ...DEFAULT_OPTIONS, ...options } as Options;
  const lens = createLens(root, _ => cloneDeep(_));
  const client = devTools.connect({
    name: usedOptions.name || undefined,
    serialize: {
      options: true,
    },
  });

  let isInitialized = false;

  const unsubscribe = watch(lens, state => {
    if (!isInitialized) {
      isInitialized = true;
      client.init(state);
      return;
    }

    client.send('@@UPDATE', state);
  });

  return () => {
    unsubscribe();
    client.unsubscribe();
  };
}
