// Copyright 2020 the RaModel authors. All rights reserved. MIT license.

import type { Lense } from '../core/lense';
import { watch } from '../core/watch';
import { useState } from './useState';
import { useEffect } from './useEffect';

export function useLense<R>(lense: Lense<R>): R {
  const [result, setResult] = useState<R>(lense().result);
  useEffect(() => watch([lense], value => setResult(value)), [lense]);

  return result;
}
