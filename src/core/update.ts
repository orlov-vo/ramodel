// Copyright 2020 the RaModel authors. All rights reserved. MIT license.

import { EVENT_EMITTER } from './symbols';
import { EVENT_UPDATE_INPUT } from './events';
import { BaseModel } from './types';

/**
 * Update input in the model and re-run main function
 *
 * @param model Model instance
 * @param input New input for model
 */
export function update<Input extends object, Public extends object>(model: BaseModel<Input, Public>, input: Input) {
  model[EVENT_EMITTER].emit(EVENT_UPDATE_INPUT, input);
}
