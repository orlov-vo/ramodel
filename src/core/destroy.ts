// Copyright 2020 the RaModel authors. All rights reserved. MIT license.

import { isModel } from './isModel';
import { createEventEmitter } from './eventEmitter';

const bus = createEventEmitter();

export const onDestroy = bus.on;

/**
 * Shutdown all side effects and clean the state in models instances
 *
 * @param instances List of instances
 */
export function destroy(...instances: unknown[]) {
  instances.forEach(instance => {
    if (isModel(instance)) {
      bus.emit('model', instance);
    } else if (typeof instance === 'function') {
      bus.emit('function', instance);
    } else if (Array.isArray(instance)) {
      instance.forEach(i => destroy(i));
      bus.emit('array', instance);
    } else if (typeof instance === 'object' && instance != null) {
      Object.values(instance).forEach(i => destroy(i));
      bus.emit('object', instance);
    }
  });
}
