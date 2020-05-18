// Copyright 2020 the RaModel authors. All rights reserved. MIT license.

import { LocalWorld } from '../LocalWorld';
import { RemoteWorld } from '../RemoteWorld';

export function expose(global: typeof globalThis): LocalWorld {
  if (!global) throw new Error("Global JS context isn't loaded");

  const symbol = global.Symbol.for('ramodel');
  const localWorld = new LocalWorld();
  const remoteWorld = new RemoteWorld({
    onLoad: async <T>(exportName: string): Promise<T> => {
      return localWorld.dwellers[exportName] as T;
    },
  });
  // eslint-disable-next-line no-param-reassign
  (global as any)[symbol] = remoteWorld;

  return localWorld;
}
