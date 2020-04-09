import { SCHEDULER, INPUT, RESULT, EVENT_EMITTER } from './symbols';
import { Scheduler } from './scheduler';
import { EventEmitter } from './eventEmitter';

export type VoidFunction = () => void;

export type GenericFunction = (this: unknown, ...args: any[]) => unknown | void;

export interface Container<Input, Public> {
  mainFn: (input: Input) => Public;
}

export interface BaseModel<Input extends object = any, Public extends object = any> {
  [SCHEDULER]: Scheduler<(input: Input) => Public, (result: Public) => void, BaseModel<Input, Public>>;
  [INPUT]: Input;
  [RESULT]: Public | null;
  [EVENT_EMITTER]: EventEmitter;
}
