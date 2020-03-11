import { BaseModel } from './types';
import { SCHEDULER, RESULT } from './symbols';

function isModel(instance: unknown): instance is BaseModel<unknown, unknown> {
  return typeof instance === 'object' && instance != null && (instance as any)[SCHEDULER] != null;
}

/**
 * Shutdown all side effects and clean the state in models instances
 *
 * @param instances List of instances
 */
export function destroy(...instances: unknown[]) {
  instances.filter(isModel).forEach(instance => {
    instance[SCHEDULER].teardown();
    instance[RESULT] = null; // eslint-disable-line no-param-reassign
  });
}
