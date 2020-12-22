// Copyright 2020 the RaModel authors. All rights reserved. MIT license.

import { SCHEDULER, INPUT, RESULT, EVENT_EMITTER, PARENT, CHILDREN, CONTEXTS } from './symbols';
import { Context } from './createContext';
import { Scheduler } from './scheduler';
import { EventEmitter } from './eventEmitter';

export type VoidFunction = () => void;

export type AsyncVoidFunction = () => Promise<void> | void;

export type GenericFunction = (this: unknown, ...args: any[]) => unknown | void;

export interface Container<Input, Public> {
  mainFn: (input: Input) => Public;
}

export interface BaseModel<Input extends object = {}, Public extends object = {}> {
  [SCHEDULER]: Scheduler<(input: Input) => Public, (result: Public) => void, BaseModel<Input, Public>> | null;
  [INPUT]: Input;
  [RESULT]: Public | null;
  [EVENT_EMITTER]: EventEmitter;
  [PARENT]: BaseModel | null;
  [CHILDREN]: BaseModel[];
  [CONTEXTS]: Map<Context<unknown>, unknown>;
}
