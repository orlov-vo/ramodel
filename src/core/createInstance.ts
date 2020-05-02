// Copyright 2020 the RaModel authors. All rights reserved. MIT license.

import { createModel } from './createModel';

export function createInstance<Input extends object, Public extends object>(
  input: Input,
  mainFn: (input: Input) => Public,
) {
  const Model = createModel(mainFn);

  return new Model(input);
}
