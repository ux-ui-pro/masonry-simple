class MasonrySimple {
  #container = null;

  #gridItems = [];

  #rowHeight = 1;

  #rowGap = 0;

  #resizeTimeout = null;

  #resizeObserver = new ResizeObserver(this.#handleResize.bind(this));

  constructor(options = {}) {
    this.#container =
      options.container instanceof HTMLElement
        ? options.container
        : document.querySelector(options.container || '.masonry');
  }

  #handleResize() {
    if (this.#resizeTimeout) {
      window.cancelAnimationFrame(this.#resizeTimeout);
    }

    this.#resizeTimeout = window.requestAnimationFrame(() => {
      this.#resizeAllItems();
    });
  }

  #resizeAllItems() {
    this.#container.style.alignItems = 'start';
    this.#gridItems.forEach((item) => {
      const rowSpan = Math.ceil(
        (item.clientHeight + this.#rowGap) / (this.#rowHeight + this.#rowGap)
      );

      item.style.gridRowEnd = `span ${rowSpan}`;
    });
  }

  init() {
    if (!this.#container) return;

    const { rowGap } = getComputedStyle(this.#container);

    this.#gridItems = Array.from(this.#container.children);
    this.#container.style.contain = 'layout';
    this.#rowGap = parseInt(rowGap, 10);
    this.#resizeObserver.observe(this.#container);
    this.#resizeAllItems();
  }

  destroy() {
    this.#resizeObserver.unobserve(this.#container);
    this.#container.style.contain = '';
    this.#container.style.alignItems = '';
    this.#gridItems.forEach((item) => {
      item.style.gridRowEnd = '';
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const masonry = new MasonrySimple();

  masonry.init();
});
