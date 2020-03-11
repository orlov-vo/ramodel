import { SCHEDULER, RESULT } from './symbols';
import { BaseModel } from './types';
import { Scheduler } from './scheduler';

type Interface<Init, Public> = Public & BaseModel<Init, Public>;

interface ModelClass<Init, Public extends object> {
  new (init: Init): Interface<Init, Public>;
}

/**
 * Create a new model
 *
 * @param run Function with Hooks should return the public state and methods
 * @returns Class for creating a model instance
 */
export function createModel<Init, Public extends object>(run: (init: Init) => Public): ModelClass<Init, Public> {
  class Model implements BaseModel<Init, Public> {
    /** Connected scheduler */
    [SCHEDULER]: Scheduler<typeof run, (result: Public) => void, this>;

    /** Public state and methods */
    [RESULT]: Public | null = null;

    constructor(init: Init) {
      /** Handler for commit phase */
      const onCommit = (result: Public): void => {
        this[RESULT] = result;
      };

      // Create and connect scheduler to the instance
      const scheduler = new Scheduler(run.bind(this, init), onCommit, this);
      this[SCHEDULER] = scheduler;
      scheduler.update();

      // Return reference to proxy-object.
      // It's needed for passing properties and making them read-only in the instance
      return new Proxy(this, {
        getPrototypeOf(target) {
          return target;
        },

        get(target, key, _reciver) {
          // Always provide original properties if them exists
          const original = (target as any)[key];
          if (original) {
            return original;
          }

          // Flush all task queue and return propery from result
          target[SCHEDULER].flush();
          const result = target[RESULT];
          if (result) {
            return (result as any)[key];
          }

          // If nothing to find here
          return undefined;
        },

        set(target, key, _value, _reciver) {
          // Allow writing only to internal fields in the instance
          return key in target;
        },

        deleteProperty(_target, _key) {
          // Deny any deleting property
          return false;
        },

        ownKeys(target) {
          // Flush all task queue and return list of property keys from result
          target[SCHEDULER].flush();
          return Object.keys(target[RESULT] || {});
        },
      });
    }
  }

  return Model as ModelClass<Init, Public>;
}
