import { SCHEDULER, RESULT } from './symbols';
import { Scheduler } from './scheduler';

export type VoidFunction = () => void;

export type GenericFunction = (this: unknown, ...args: any[]) => unknown | void;

export interface Container<Init, Public> {
  mainFn: (init: Init) => Public;
}

export interface BaseModel<Init, Public> {
  [SCHEDULER]: Scheduler<(init: Init) => Public, (result: Public) => void, BaseModel<Init, Public>>;
  [RESULT]: Public | null;
}
