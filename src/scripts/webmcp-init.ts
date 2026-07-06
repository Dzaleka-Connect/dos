// Only load the WebMCP toolkit when the browser actually exposes the
// Model Context API — keeps the module out of the common bundle path.
if (window.isSecureContext && window.top === window && navigator.modelContext) {
  import('../utils/webmcp').then(({ initializeWebMcp }) => {
    initializeWebMcp();
  });
}
