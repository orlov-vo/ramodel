// Copyright 2020 the RaModel authors. All rights reserved. MIT license.

import { nanoid } from 'nanoid/non-secure';
import { connect as genericConnect } from '../generic/mod';
import { RemoteWorld } from '../RemoteWorld';
import { sendMessage } from './sendMessage';

export function connect(key = 'ramodelCrossTabMessageBus'): RemoteWorld {
  const clientId = nanoid(6);

  return genericConnect({
    postMessage: msg => sendMessage(key, msg, { clientId }),
    onInit: ({ onMessage }) => {
      globalThis.addEventListener('storage', (event: StorageEvent) => {
        if (event.key !== key || event.newValue == null) return;

        const { message, ...meta } = JSON.parse(event.newValue);
        if (clientId !== meta.clientId) return;

        onMessage(message);
      });
    },
  });
}
