// Copyright 2020 the RaModel authors. All rights reserved. MIT license.

type Handler = (...args: any[]) => unknown;
type UnsubscribeFn = () => void;

/**
 * Function that creates simple event emitter
 *
 * @returns Event emitter API
 */
export const createEventEmitter = () => {
  const events: Record<string, Handler[]> = {};

  return {
    /**
     * Trigger the event, calls all subscribed handlers
     *
     * @param event Event name
     * @param args Arguments
     */
    emit(event: string, ...args: unknown[]): void {
      (events[event] || []).forEach(i => i(...args));
    },

    /**
     * Subscribe for the event
     *
     * @param name Event name
     * @param handler Event handler
     * @returns Function for unsubscribe
     */
    on(event: string, handler: Handler): UnsubscribeFn {
      (events[event] = events[event] || []).push(handler);

      return () => {
        events[event] = events[event].filter(i => i !== handler);
      };
    },
  };
};

export type EventEmitter = ReturnType<typeof createEventEmitter>;
