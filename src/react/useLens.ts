// Copyright 2020 the RaModel authors. All rights reserved. MIT license.

import { useState, useEffect } from 'react';
import type { Lens } from '../core/lens';

export function useLens<R>(lens: Lens<R>): R {
  const [result, setResult] = useState<R>(lens().result);
  useEffect(() => lens.subscribe(value => setResult(value)), [lens]);

  return result;
}
