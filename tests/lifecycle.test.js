import assert from 'node:assert/strict';
import test from 'node:test';

const api = await import('../dist/index.js').catch(() => null);

const MasonrySimple = api?.default;

class MockHTMLElement {
  constructor() {
    this.style = {};
    this.children = [];
    this.clientHeight = 0;
  }

  querySelectorAll() {
    return [];
  }

  getBoundingClientRect() {
    return { height: this.clientHeight };
  }
}

class MockContainer extends MockHTMLElement {}

class MockItem extends MockHTMLElement {
  constructor(height) {
    super();
    this.clientHeight = height;
    this.images = [];
  }

  querySelectorAll(selector) {
    if (selector !== 'img') return [];
    return this.images;
  }
}

class MockResizeObserver {
  constructor(callback) {
    this.callback = callback;
    this.observed = [];
    this.disconnectCalls = 0;
    MockResizeObserver.instances.push(this);
  }

  observe(node) {
    this.observed.push(node);
  }

  disconnect() {
    this.disconnectCalls += 1;
  }
}

MockResizeObserver.instances = [];

class MockMutationObserver {
  constructor(callback) {
    this.callback = callback;
    this.observed = [];
    this.disconnectCalls = 0;
    MockMutationObserver.instances.push(this);
  }

  observe(node, options) {
    this.observed.push({ node, options });
  }

  disconnect() {
    this.disconnectCalls += 1;
  }
}

MockMutationObserver.instances = [];

class MockImage {
  constructor() {
    this.complete = false;
    this.listeners = [];
  }

  addEventListener(type, callback, options = {}) {
    if (type !== 'load') return;

    if (options.signal?.aborted) return;

    this.listeners.push({
      callback,
      once: Boolean(options.once),
    });

    if (options.signal) {
      options.signal.addEventListener('abort', () => {
        this.listeners = [];
      });
    }
  }

  emitLoad() {
    const listeners = [...this.listeners];
    this.listeners = this.listeners.filter((listener) => !listener.once);

    listeners.forEach((listener) => {
      listener.callback();
    });
    this.complete = true;
  }
}

function installDomMocks() {
  const state = {
    rafCallbacks: new Map(),
    rafCounter: 0,
    oldHTMLElement: globalThis.HTMLElement,
    oldResizeObserver: globalThis.ResizeObserver,
    oldMutationObserver: globalThis.MutationObserver,
    oldGetComputedStyle: globalThis.getComputedStyle,
    oldRequestAnimationFrame: globalThis.requestAnimationFrame,
    oldCancelAnimationFrame: globalThis.cancelAnimationFrame,
    oldDocument: globalThis.document,
  };

  globalThis.HTMLElement = MockHTMLElement;
  globalThis.ResizeObserver = MockResizeObserver;
  globalThis.MutationObserver = MockMutationObserver;
  globalThis.getComputedStyle = () => ({
    rowGap: '10px',
    gridAutoRows: '1px',
  });
  globalThis.requestAnimationFrame = (callback) => {
    state.rafCounter += 1;
    const rafId = state.rafCounter;
    state.rafCallbacks.set(rafId, callback);
    return rafId;
  };
  globalThis.cancelAnimationFrame = (rafId) => {
    state.rafCallbacks.delete(rafId);
  };
  globalThis.document = undefined;

  const flushRaf = () => {
    const callbacks = Array.from(state.rafCallbacks.values());
    state.rafCallbacks.clear();
    callbacks.forEach((callback) => {
      callback(0);
    });
  };

  const restore = () => {
    globalThis.HTMLElement = state.oldHTMLElement;
    globalThis.ResizeObserver = state.oldResizeObserver;
    globalThis.MutationObserver = state.oldMutationObserver;
    globalThis.getComputedStyle = state.oldGetComputedStyle;
    globalThis.requestAnimationFrame = state.oldRequestAnimationFrame;
    globalThis.cancelAnimationFrame = state.oldCancelAnimationFrame;
    globalThis.document = state.oldDocument;
    MockResizeObserver.instances = [];
    MockMutationObserver.instances = [];
  };

  return { flushRaf, restore };
}

if (MasonrySimple) {
  test('init is idempotent and does not duplicate observers', () => {
    const { restore } = installDomMocks();
    const container = new MockContainer();
    const item = new MockItem(200);
    container.children = [item];

    const masonry = new MasonrySimple({ container });
    masonry.init();
    masonry.init();

    assert.equal(MockResizeObserver.instances.length, 1);
    assert.equal(MockMutationObserver.instances.length, 1);

    restore();
  });

  test('destroy cancels scheduled frame and restores styles', () => {
    const { flushRaf, restore } = installDomMocks();
    const container = new MockContainer();
    container.style.gridAutoRows = '5px';
    container.style.contain = 'paint';
    container.style.alignItems = 'center';

    const item = new MockItem(180);
    item.images = [new MockImage(), new MockImage()];
    container.children = [item];

    const masonry = new MasonrySimple({ container });
    masonry.init();
    masonry.refresh();
    masonry.destroy();
    flushRaf();

    assert.equal(container.style.gridAutoRows, '5px');
    assert.equal(container.style.contain, 'paint');
    assert.equal(container.style.alignItems, 'center');
    assert.equal(item.style.gridRowEnd, '');

    restore();
  });

  test('refresh after destroy is safe no-op', () => {
    const { restore } = installDomMocks();
    const container = new MockContainer();
    const item = new MockItem(120);
    container.children = [item];

    const masonry = new MasonrySimple({ container });
    masonry.init();
    masonry.destroy();

    assert.doesNotThrow(() => masonry.refresh());

    restore();
  });
}
