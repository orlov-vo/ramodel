// Copyright 2020 the RaModel authors. All rights reserved. MIT license.

import type { ModelClass } from '../core/createModel';
import type { Context } from '../core/createContext';
import { update } from '../core/update';
import { useModelFabric } from './useModelFabric';
import { useMemo } from './useMemo';
import { useEffect } from './useEffect';

type UseModelOptions<Input> = {
  input: Input;
  contexts?: Array<[Context<any>, any]>;
};

export function useModel<Input extends object, Public extends object>(
  Model: ModelClass<Input, Public>,
  options: UseModelOptions<Input>,
): Public {
  const createInstance = useModelFabric(Model, options);
  const instance = useMemo(() => createInstance(options.input), []);

  useEffect(() => {
    update(instance, options.input);
  }, Object.values(options.input));

  return instance;
}
