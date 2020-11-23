// Copyright 2020 the RaModel authors. All rights reserved. MIT license.

/// <reference lib="webworker" />
import { expose as genericExpose } from '../generic/mod';
import { LocalWorld } from '../LocalWorld';

export function expose(): LocalWorld {
  return genericExpose({
    onInit: ({ onMessage }) => {
      globalThis.onmessage = (event): void => {
        if (!(event instanceof MessageEvent)) return;
        onMessage(event.data, globalThis.postMessage);
      };
    },
  });
}
