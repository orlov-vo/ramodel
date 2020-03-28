import { SCHEDULER, RESULT, EVENT_EMITTER } from './symbols';
import { Scheduler } from './scheduler';
import { EventEmitter } from './eventEmitter';

export type VoidFunction = () => void;

export type GenericFunction = (this: unknown, ...args: any[]) => unknown | void;

export interface Container<Init, Public> {
  mainFn: (init: Init) => Public;
}

export interface BaseModel<Init extends object = any, Public extends object = any> {
  [SCHEDULER]: Scheduler<(init: Init) => Public, (result: Public) => void, BaseModel<Init, Public>>;
  [RESULT]: Public | null;
  [EVENT_EMITTER]: EventEmitter;
}
