// Run the bounded proof calculation off the main thread so forms stay responsive.
self.onmessage = async (event: MessageEvent<string>) => {
  const token = event.data, encoder = new TextEncoder();
  for (let work = 0; work < 5000000; work++) {
    const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(token + ':' + work)));
    if (digest[0] === 0 && digest[1] === 0) { self.postMessage(String(work)); return; }
  }
  self.postMessage(null);
};
export {};
