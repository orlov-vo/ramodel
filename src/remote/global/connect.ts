// Copyright 2020 the RaModel authors. All rights reserved. MIT license.

import { RemoteWorld } from '../RemoteWorld';

export function connect(global: typeof globalThis): RemoteWorld {
  if (!global) throw new Error("Global JS context isn't loaded");

  const symbol = global.Symbol.for('ramodel');

  return (global as any)[symbol];
}
