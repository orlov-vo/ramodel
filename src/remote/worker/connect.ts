// Copyright 2020 the RaModel authors. All rights reserved. MIT license.

import { connect as genericConnect } from '../generic/mod';
import { RemoteWorld } from '../RemoteWorld';

export function connect(worker: Worker | MessagePort): RemoteWorld {
  return genericConnect({
    postMessage: msg => worker.postMessage(msg),
    onInit: ({ onMessage }) => {
      worker.addEventListener('message', (event: Event) => {
        if (!(event instanceof MessageEvent)) return;
        onMessage(event.data);
      });
    },
  });
}
