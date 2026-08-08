import "@testing-library/jest-dom/vitest";

// jsdom lacks these APIs that motion/scroll-reveal components rely on.
if (!("IntersectionObserver" in globalThis)) {
  class MockIntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
    root = null;
    rootMargin = "";
    thresholds = [];
  }
  // @ts-expect-error test shim
  globalThis.IntersectionObserver = MockIntersectionObserver;
}

if (!globalThis.matchMedia) {
  // @ts-expect-error test shim
  globalThis.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

globalThis.scrollTo = globalThis.scrollTo ?? (() => {});
