/* eslint-disable @typescript-eslint/indent */
import idx from 'idx';

/**
 * DeepRequiredArray
 * Nested array condition handler
 */
interface DeepRequiredArray<T> extends Array<DeepRequired<NonNullable<T>>> {}

/**
 * DeepRequiredObject
 * Nested object condition handler
 */
type DeepRequiredObject<T extends object> = {
  [P in keyof T]-?: DeepRequired<NonNullable<T[P]>>;
};

/**
 * Function that has deeply required return type
 */
type FunctionWithRequiredReturnType<T extends (...args: any[]) => any> = T extends (...args: infer A) => infer R
  ? (...args: A) => DeepRequired<R>
  : never;

/**
 * DeepRequired
 * Required that works for deeply nested structure
 */
type DeepRequired<T> = T extends any[]
  ? DeepRequiredArray<T[number]>
  : T extends (...args: any[]) => any
  ? FunctionWithRequiredReturnType<T>
  : T extends object
  ? DeepRequiredObject<T>
  : T;

export type Accessor<Input, Result> = (prop: NonNullable<DeepRequired<Input>>) => Result;

export const get = idx;
