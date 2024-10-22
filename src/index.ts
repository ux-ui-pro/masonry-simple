class MasonrySimple {
  private container: HTMLElement | null;
  private gridItems: HTMLElement[] = [];
  private rowHeight = 1;
  private rowGap = 0;
  private resizeObserver: ResizeObserver | null = null;
  private abortController: AbortController | null = null;

  constructor(options: { container?: HTMLElement | string } = {}) {
    this.container =
      options.container instanceof HTMLElement
        ? options.container
        : typeof options.container === 'string'
          ? document.querySelector(options.container)
          : document.querySelector('.masonry') || null;
  }

  private handleResize(): void {
    const callback = (): void => this.resizeAllItems();

    (
      window as Window &
        typeof globalThis & {
          requestIdleCallback: (
            callback: IdleRequestCallback,
            options?: IdleRequestOptions,
          ) => void;
        }
    ).requestIdleCallback(callback, { timeout: 200 });
  }

  private resizeAllItems(): void {
    if (!this.container) return;

    this.container.style.alignItems = 'start';
    this.gridItems.forEach((item) => {
      const rowSpan = Math.ceil((item.clientHeight + this.rowGap) / (this.rowHeight + this.rowGap));

      item.style.gridRowEnd = `span ${rowSpan}`;
    });
  }

  public init(): void {
    if (!this.container) return;

    this.setupAbortController();
    this.setupResizeObserver();
    this.initializeContainerStyles();
    this.initializeGridItems();
    this.resizeAllItems();
  }

  private setupAbortController(): void {
    this.abortController = new AbortController();
    this.abortController.signal.addEventListener('abort', () => {
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
      }
    });
  }

  private setupResizeObserver(): void {
    this.resizeObserver = new ResizeObserver(() => this.handleResize());

    if (this.resizeObserver) {
      this.resizeObserver.observe(this.container!);
      this.gridItems.forEach((item) => this.resizeObserver!.observe(item));
    }
  }

  private initializeContainerStyles(): void {
    const computedStyle = getComputedStyle(this.container!);

    this.rowGap = parseInt(computedStyle.rowGap, 10) || 0;
    this.rowHeight = parseInt(computedStyle.gridAutoRows, 10) || this.rowHeight;

    this.container!.style.contain = 'layout';
  }

  private initializeGridItems(): void {
    this.gridItems = Array.from(this.container!.children) as HTMLElement[];
  }

  public destroy(): void {
    if (!this.container || !this.abortController || !this.resizeObserver) return;

    this.abortController.abort();

    this.container.style.contain = '';
    this.container.style.alignItems = '';
    this.gridItems.forEach((item) => {
      item.style.gridRowEnd = '';
    });

    this.abortController = null;
    this.resizeObserver = null;
  }
}

export default MasonrySimple;
