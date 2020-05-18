// Copyright 2020 the RaModel authors. All rights reserved. MIT license.

import { SCHEDULER, INPUT, RESULT, EVENT_EMITTER, PARENT, CHILDREN, CONTEXTS } from './symbols';
import { EVENT_CHANGE, EVENT_UPDATE_INPUT } from './events';
import { Context } from './createContext';
import { BaseModel } from './types';
import { Scheduler } from './scheduler';
import { notify } from './lens';
import { EventEmitter, createEventEmitter } from './eventEmitter';
import { onDestroy } from './destroy';
import { shallowCompare } from './shallowCompare';

type Interface<Input extends object, Public extends object> = Public & BaseModel<Input, Public>;

export interface ModelClass<Input extends object, Public extends object> {
  new (input: Input): Interface<Input, Public>;
}

const INIT_EVENT = 'init' as const;

const bus = createEventEmitter();

export const onInit: (handler: (instance: BaseModel) => void) => () => void = bus.on.bind(null, INIT_EVENT);

/**
 * Synchronously retrieve result from instance after state updates
 *
 * @param target Model's instance
 * @returns Fresh result from instance
 */
function getFreshResult(target: BaseModel) {
  const scheduler = target[SCHEDULER];

  // If instance is destroyed forgot about getting result
  if (scheduler == null) {
    return undefined;
  }

  // Flush all task queue and get fresh result
  scheduler.flush();
  return target[RESULT];
}

let currentModelInExecuting: BaseModel | null = null;

/**
 * Create a new model
 *
 * @param run Function with Hooks should return the public state and methods
 * @returns Class for creating a model instance
 */
export function createModel<Input extends object, Public extends object>(
  run: (input: Input) => Public,
): ModelClass<Input, Public> {
  class Model implements BaseModel<Input, Public> {
    /** Connected scheduler (it can be `null` when instance is destroyed) */
    [SCHEDULER]: Scheduler<typeof run, (result: Public) => void, this>;

    /** Input properties */
    [INPUT]: Input;

    /** Public state and methods */
    [RESULT]: Public | null;

    /** Event emitter */
    [EVENT_EMITTER]: EventEmitter;

    /** Parent model */
    [PARENT]: BaseModel | null;

    /** Children models */
    [CHILDREN]: BaseModel[];

    /** Contexts */
    [CONTEXTS]: Map<Context<unknown>, unknown>;

    constructor(input: Input) {
      this[INPUT] = input;
      this[RESULT] = null;
      this[EVENT_EMITTER] = createEventEmitter();
      this[PARENT] = currentModelInExecuting;
      this[CHILDREN] = [];
      this[CONTEXTS] = new Map();

      /** Handler for commit phase */
      const onCommit = (result: Public): void => {
        this[RESULT] = result;
        this[EVENT_EMITTER].emit(EVENT_CHANGE, this[RESULT]);
      };

      /** Handler for reading phase */
      const onRun = () => {
        // Set current instance to `currentModelInExecuting` only in run method
        const lastCurrentModelInExecuting = currentModelInExecuting;
        currentModelInExecuting = this;
        const result = run(this[INPUT]);
        currentModelInExecuting = lastCurrentModelInExecuting;

        return result;
      };

      // Create and connect scheduler to the instance
      const scheduler = new Scheduler(onRun, onCommit, this);
      this[SCHEDULER] = scheduler;
      scheduler.update();

      // Subscribe on updates from `update` method
      this[EVENT_EMITTER].on(EVENT_UPDATE_INPUT, (newInput: Input): void => {
        const oldInput = this[INPUT];
        this[INPUT] = newInput;

        // Run update if something in input has been changed
        if (!shallowCompare(oldInput, newInput)) {
          scheduler.update();
        }
      });

      // Add this instance to the parent element
      const parent = this[PARENT];
      if (parent) {
        parent[CHILDREN].push(this);
      }

      // Emit init event to all subscribers of `onInit`
      bus.emit(INIT_EVENT, this);

      // Return reference to proxy-object.
      // It's needed for passing properties and making them read-only in the instance
      return new Proxy(this, {
        getPrototypeOf(target) {
          return target;
        },

        get(target, key, _reciver) {
          // Always provide original properties if them exists
          if (key in target) {
            return (target as any)[key];
          }

          const result = getFreshResult(target);
          if (result == null) {
            return undefined;
          }

          const value = (result as any)[key];
          notify(target, key, value);

          return value;
        },

        set(target, key, value, _reciver) {
          // Allow writing only to internal fields in the instance
          if (key in target) {
            // eslint-disable-next-line no-param-reassign
            (target as any)[key] = value;
            return true;
          }

          return false;
        },

        has(target, key) {
          if (key in target) {
            return true;
          }

          const result = getFreshResult(target);
          return result != null ? key in result : false;
        },

        deleteProperty(_target, _key) {
          // Deny any deleting property
          return false;
        },

        ownKeys(target) {
          const result = getFreshResult(target);
          return result != null ? Object.keys(result) : [];
        },

        getOwnPropertyDescriptor(target, key) {
          if (key in target) {
            return Object.getOwnPropertyDescriptor(target, key);
          }

          const result = getFreshResult(target);
          return result != null ? Object.getOwnPropertyDescriptor(result, key) : undefined;
        },
      });
    }
  }

  return Model as ModelClass<Input, Public>;
}

onDestroy('model', instance => {
  if (instance[SCHEDULER] == null) return;

  /* eslint-disable no-param-reassign */
  instance[SCHEDULER].teardown();
  instance[SCHEDULER] = null;
  instance[RESULT] = null;
  instance[PARENT] = null;
  instance[CHILDREN] = [];
  instance[CONTEXTS].clear();
  /* eslint-enable */
});
