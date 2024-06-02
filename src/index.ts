class MasonrySimple {
  private readonly container: HTMLElement | null = null;

  private gridItems: HTMLElement[] = [];

  private rowHeight: number = 1;

  private rowGap: number = 0;

  private resizeTimeout: number | null = null;

  private resizeObserver: ResizeObserver;

  constructor(options: { container?: HTMLElement | string } = {}) {
    this.container = options.container instanceof HTMLElement
      ? options.container
      : document.querySelector(options.container || '.masonry') as HTMLElement;

    this.resizeObserver = new ResizeObserver(() => this.handleResize());
  }

  private handleResize() {
    if (this.resizeTimeout !== null) {
      window.cancelAnimationFrame(this.resizeTimeout);
    }

    this.resizeTimeout = window.requestAnimationFrame(() => this.resizeAllItems());
  }

  private resizeAllItems() {
    if (!this.container) return;

    this.container.style.alignItems = 'start';
    this.gridItems.forEach((item) => {
      const rowSpan = Math.ceil(
        (item.clientHeight + this.rowGap) / (this.rowHeight + this.rowGap),
      );

      const { style } = item;

      style.gridRowEnd = `span ${rowSpan}`;
    });
  }

  public init() {
    if (!this.container) return;

    const computedStyle = getComputedStyle(this.container);

    this.rowGap = parseInt(computedStyle.rowGap, 10);
    this.rowHeight = parseInt(computedStyle.gridAutoRows, 10) || this.rowHeight;

    this.gridItems = Array.from(this.container.children) as HTMLElement[];
    this.container.style.contain = 'layout';
    this.resizeObserver.observe(this.container);
    this.gridItems.forEach((item) => this.resizeObserver.observe(item));

    this.resizeAllItems();
  }

  public destroy() {
    if (!this.container) return;

    this.resizeObserver.unobserve(this.container);
    this.gridItems.forEach((item) => this.resizeObserver.unobserve(item));

    this.container.style.contain = '';
    this.container.style.alignItems = '';
    this.gridItems.forEach((item) => {
      const { style } = item;

      style.gridRowEnd = '';
    });
  }
}

export default MasonrySimple;
