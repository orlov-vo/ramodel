// Copyright 2020 the RaModel authors. All rights reserved. MIT license.

import type { ModelClass } from '../core/createModel';
import type { Context } from '../core/createContext';
import { useModelFabric } from './useModelFabric';

type UseModelOptions<Input> = {
  input: Input;
  contexts?: Array<[Context<any>, any]>;
};

export function useModel<Input extends object, Public extends object>(
  Model: ModelClass<Input, Public>,
  options: UseModelOptions<Input>,
): Public {
  const createInstance = useModelFabric(Model, options);
  const [instance] = createInstance(options.input);

  return instance;
}
