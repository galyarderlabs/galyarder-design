// jsdom does not implement `window.matchMedia`. Components rendered in tests
// read it during render — SettingsDialog's responsive layout
// (`matchMedia('(max-width: 767px)')`), ConnectorLogo/ThemeProvider theme
// detection, and Sonner toasts. Provide a default stub whenever a DOM
// environment is active; tests that need to drive media-query changes still
// override this with their own `configurable` definition.
if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}
