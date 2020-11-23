export function sendMessage(key: string, message: unknown, meta = {}) {
  const relay = {
    ...meta,
    message,
    timestamp: Date.now(),
  };

  try {
    localStorage[key] = JSON.stringify(relay);
  } catch (e) {
    console.error('Tried to cross-tab relay non-json-able message:', message);
    throw e;
  }
}
