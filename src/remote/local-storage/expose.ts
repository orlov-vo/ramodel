// Copyright 2020 the RaModel authors. All rights reserved. MIT license.

import { expose as genericExpose } from '../generic/mod';
import { LocalWorld } from '../LocalWorld';
import { sendMessage } from './sendMessage';

export function expose(key = 'ramodelCrossTabMessageBus'): LocalWorld {
  return genericExpose({
    onInit: ({ onMessage }) => {
      globalThis.addEventListener('storage', (event: StorageEvent) => {
        if (event.key !== key || event.newValue == null) return;

        const { message, ...meta } = JSON.parse(event.newValue);
        if (!meta.clientId) return;

        onMessage(message, data => sendMessage(key, data, { clientId: meta.clientId }));
      });
    },
  });
}
