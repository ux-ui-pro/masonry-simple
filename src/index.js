class MasonrySimple {
  constructor() {
    this.container = null;
    this.gridItems = [];
    this.rowHeight = 1;
    this.rowGap = 0;
    this.resizeTimeout = null;
    this.resizeObserver = new ResizeObserver(this.handleResize.bind(this));
  }

  handleResize() {
    if (this.resizeTimeout) {
      window.cancelAnimationFrame(this.resizeTimeout);
    }

    this.resizeTimeout = window.requestAnimationFrame(() => {
      this.resizeAllItems();
    });
  }

  resizeAllItems() {
    this.container.style.alignItems = 'start';
    this.gridItems.forEach((item) => {
      const rowSpan = Math.ceil(
        (item.clientHeight + this.rowGap) / (this.rowHeight + this.rowGap)
      );

      item.style.gridRowEnd = `span ${ rowSpan }`;
    });
  }

  static init(options = {}) {
    const { container = '.masonry' } = options;
    const masonry = new MasonrySimple();

    masonry.container =
      container instanceof HTMLElement
        ? container
        : document.querySelector(container);

    if (!masonry.container) return;

    masonry.gridItems = Array.from(masonry.container.children);
    masonry.container.style.contain = 'layout';
    masonry.rowGap = parseInt(getComputedStyle(masonry.container).rowGap, 10);
    masonry.resizeObserver.observe(masonry.container);
    masonry.resizeAllItems();

    return masonry;
  }

  destroy() {
    this.resizeObserver.unobserve(this.container);
    this.container.style.contain = '';
    this.container.style.alignItems = '';
    this.gridItems.forEach((item) => {
      item.style.gridRowEnd = '';
    });
  }
}

export default MasonrySimple;
