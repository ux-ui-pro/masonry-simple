interface MasonrySimpleOptions {
  container?: HTMLElement | string;
}

export default class MasonrySimple {
  private readonly container: HTMLElement | null;
  private gridItems: HTMLElement[] = [];
  private rowHeight = 1;
  private rowGap = 0;
  private resizeScheduled = false;
  private resizeObserver: ResizeObserver | null = null;
  private mutationObserver: MutationObserver | null = null;
  private abortController: AbortController | null = null;
  private originalAutoRows = '';

  constructor(options: MasonrySimpleOptions = {}) {
    this.container =
      options.container instanceof HTMLElement
        ? options.container
        : typeof options.container === 'string'
          ? document.querySelector(options.container)
          : document.querySelector('.masonry');
  }

  public init(): void {
    if (!this.container) return;

    this.setupAbortController();
    this.storeAndSetAutoRows();
    this.initializeContainerStyles();
    this.initializeGridItems();
    this.setupResizeObserver();
    this.setupMutationObserver();
    this.resizeAllItems();
  }

  public refresh(): void {
    this.initializeGridItems();
    this.resizeAllItems();
  }

  public destroy(): void {
    if (!this.container) return;

    this.abortController?.abort();

    this.container.style.gridAutoRows = this.originalAutoRows;

    this.container.style.contain = '';
    this.container.style.alignItems = '';

    this.gridItems.forEach((item) => (item.style.gridRowEnd = ''));

    this.gridItems = [];
    this.resizeObserver = null;
    this.mutationObserver = null;
    this.abortController = null;
    this.originalAutoRows = '';
  }

  private handleResize(): void {
    if (this.resizeScheduled) return;

    this.resizeScheduled = true;

    requestAnimationFrame(() => {
      this.resizeAllItems();
      this.resizeScheduled = false;
    });
  }

  private resizeAllItems(): void {
    if (!this.container) return;

    this.container.style.alignItems = 'start';

    this.gridItems.forEach((item) => {
      const rowSpan = Math.ceil((item.clientHeight + this.rowGap) / (this.rowHeight + this.rowGap));

      item.style.gridRowEnd = `span ${rowSpan}`;
    });
  }

  private setupAbortController(): void {
    this.abortController = new AbortController();

    this.abortController.signal.addEventListener('abort', () => {
      this.resizeObserver?.disconnect();
      this.mutationObserver?.disconnect();
    });
  }

  private setupResizeObserver(): void {
    this.resizeObserver = new ResizeObserver(() => this.handleResize());

    this.resizeObserver.observe(this.container!);
  }

  private setupMutationObserver(): void {
    this.mutationObserver = new MutationObserver(() => {
      this.initializeGridItems();
      this.resizeAllItems();
    });

    this.mutationObserver.observe(this.container!, {
      childList: true,
      subtree: false,
    });
  }

  private initializeContainerStyles(): void {
    if (!this.container) return;

    const cs = getComputedStyle(this.container);

    this.rowGap = parseInt(cs.rowGap, 10) || 0;

    const parsed = parseInt(cs.gridAutoRows, 10);

    this.rowHeight = Number.isNaN(parsed) ? this.rowHeight : parsed;
    this.container.style.contain = 'layout';
  }

  private initializeGridItems(): void {
    if (!this.container) return;

    this.gridItems = Array.from(this.container.children) as HTMLElement[];

    this.gridItems.forEach((item) => {
      const img = item.querySelector('img');

      if (img && !img.complete) {
        img.addEventListener('load', () => this.resizeAllItems(), { once: true });
      }
    });
  }

  private storeAndSetAutoRows(): void {
    if (!this.container) return;

    if (!this.originalAutoRows) {
      this.originalAutoRows = this.container.style.gridAutoRows || '';
    }

    this.container.style.gridAutoRows = '1px';
  }
}
