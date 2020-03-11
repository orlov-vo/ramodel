import { BaseModel } from './types';
import { SCHEDULER, RESULT } from './symbols';

/**
 * Shutdown all side effects and clean the state in models instances
 *
 * @param instances List of instances
 */
export function destroy(...instances: Array<BaseModel<unknown, unknown>>) {
  instances.forEach(instance => {
    instance[SCHEDULER].teardown();
    instance[RESULT] = null; // eslint-disable-line no-param-reassign
  });
}
