// Copyright 2020 the RaModel authors. All rights reserved. MIT license.

import { EVENT_EMITTER } from './symbols';
import { EVENT_UPDATE_INPUT } from './events';
import { isModel } from './isModel';

/**
 * Update input in the instance and re-run main function
 *
 * @param instance Model instance
 * @param input New input for instance
 */
export function update<Input extends object>(instance: unknown, input: Input) {
  if (!isModel(instance)) throw new Error("Couldn't update input for non Model's instance");

  instance[EVENT_EMITTER].emit(EVENT_UPDATE_INPUT, input);
}
