import { SCHEDULER, RESULT } from './symbols';
import { isModel } from './isModel';

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
