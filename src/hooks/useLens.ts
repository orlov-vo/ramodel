// Copyright 2020 the RaModel authors. All rights reserved. MIT license.

import type { Lens } from '../core/lens';
import { useState } from './useState';
import { useEffect } from './useEffect';

export function useLens<R>(lens: Lens<R>): R {
  const [result, setResult] = useState<R>(lens().result);
  useEffect(() => lens.subscribe(value => setResult(value)), [lens]);

  return result;
}
