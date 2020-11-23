export type Message<T extends string, Q = any, P = any> = { type: T; query: Q; payload: P };
export type QueryMessage<T extends string, Q = any> = { type: T; query: Q };
export type ErrorMessage<T extends string, Q = any, E = any> = { type: T; query: Q; error: E };
