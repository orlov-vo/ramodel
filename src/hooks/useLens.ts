// Copyright 2020 the RaModel authors. All rights reserved. MIT license.

import type { Accessor } from '../core/get';
import { createLens, isLens, Lens } from '../core/lens';
import { useState } from './useState';
import { useEffect } from './useEffect';
import { useMemo } from './useMemo';
import { useRef } from './useRef';

export function useLens<R>(lens: Lens<R>): R;
export function useLens<T, R>(instance: T, accessor: Accessor<T, R>): R;

export function useLens<T, R>(instanceOrLens: Lens<R> | T, accessor?: Accessor<T, R>): R {
  const lens = useMemo(() => {
    if (isLens(instanceOrLens)) {
      return instanceOrLens;
    }

    if (accessor == null) {
      throw new TypeError('Second argument "accessor" should be defined');
    }

    return createLens(instanceOrLens, accessor);
  }, [instanceOrLens]);

  // We calculate initialState only once on first initialization, on next ticks
  // initialState should become `null` to release reference to value to GC can collect it
  const internal = useRef(false);
  const initialState: R = useMemo(() => {
    if (internal.current) return (null as unknown) as R;

    const { result } = lens();
    internal.current = true;

    return result;
  });
  const [result, setResult] = useState<R>(initialState);

  useEffect(() => lens.subscribe(value => setResult(value)), [lens]);

  return result;
}
