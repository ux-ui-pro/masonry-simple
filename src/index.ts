interface MasonrySimpleOptions {
  container?: HTMLElement | string;
}

export default class MasonrySimple {
  private readonly containerOption: HTMLElement | string | undefined;
  private container: HTMLElement | null = null;
  private gridItems: HTMLElement[] = [];
  private rowHeight = 1;
  private rowGap = 0;
  private resizeScheduled = false;
  private rafId: number | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private mutationObserver: MutationObserver | null = null;
  private observerAbortController: AbortController | null = null;
  private imageAbortController: AbortController | null = null;
  private observedImages = new WeakSet<HTMLImageElement>();
  private isInitialized = false;
  private isDestroyed = false;
  private originalContainerStyles = {
    gridAutoRows: '',
    contain: '',
    alignItems: '',
  };

  constructor(options: MasonrySimpleOptions = {}) {
    this.containerOption = options.container;
  }

  public init(): void {
    if (this.isInitialized) return;

    this.container = this.resolveContainer();

    if (!this.container) return;

    this.isInitialized = true;
    this.isDestroyed = false;

    this.setupAbortControllers();
    this.storeContainerStyles();
    this.initializeContainerStyles();
    this.initializeGridItems();
    this.setupResizeObserver();
    this.setupMutationObserver();
    this.scheduleLayout();
  }

  public refresh(): void {
    if (!this.isInitialized || this.isDestroyed || !this.container) return;

    this.initializeGridItems();
    this.scheduleLayout();
  }

  public destroy(): void {
    if (!this.isInitialized && !this.container) return;

    this.isDestroyed = true;
    this.isInitialized = false;
    this.cancelScheduledLayout();
    this.observerAbortController?.abort();
    this.imageAbortController?.abort();
    this.resizeObserver?.disconnect();
    this.mutationObserver?.disconnect();
    this.gridItems.forEach((item) => {
      item.style.gridRowEnd = '';
    });

    if (this.container) {
      this.container.style.gridAutoRows = this.originalContainerStyles.gridAutoRows;
      this.container.style.contain = this.originalContainerStyles.contain;
      this.container.style.alignItems = this.originalContainerStyles.alignItems;
    }

    this.gridItems = [];
    this.rowHeight = 1;
    this.rowGap = 0;
    this.resizeObserver = null;
    this.mutationObserver = null;
    this.observerAbortController = null;
    this.imageAbortController = null;
    this.observedImages = new WeakSet<HTMLImageElement>();
    this.resizeScheduled = false;
    this.container = null;
    this.originalContainerStyles = {
      gridAutoRows: '',
      contain: '',
      alignItems: '',
    };
  }

  private resolveContainer(): HTMLElement | null {
    if (this.containerOption instanceof HTMLElement) {
      return this.containerOption;
    }

    if (typeof document === 'undefined') return null;

    if (typeof this.containerOption === 'string') {
      return document.querySelector<HTMLElement>(this.containerOption);
    }

    return document.querySelector<HTMLElement>('.masonry');
  }

  private scheduleLayout(): void {
    if (!this.isInitialized || this.isDestroyed || !this.container || this.resizeScheduled) return;

    this.resizeScheduled = true;

    if (typeof requestAnimationFrame === 'function') {
      this.rafId = requestAnimationFrame(() => {
        this.rafId = null;
        this.resizeScheduled = false;
        this.performLayout();
      });

      return;
    }

    this.rafId = null;
    this.resizeScheduled = false;
    this.performLayout();
  }

  private cancelScheduledLayout(): void {
    if (this.rafId !== null && typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(this.rafId);
    }

    this.rafId = null;
    this.resizeScheduled = false;
  }

  private performLayout(): void {
    if (!this.isInitialized || this.isDestroyed || !this.container) return;

    this.measureContainerMetrics();
    this.resizeAllItems();
  }

  private resizeAllItems(): void {
    const denominator = this.rowHeight + this.rowGap;

    this.gridItems.forEach((item) => {
      if (denominator <= 0 || !Number.isFinite(denominator)) {
        item.style.gridRowEnd = 'span 1';

        return;
      }

      const rowSpan = Math.max(
        1,
        Math.ceil((item.getBoundingClientRect().height + this.rowGap) / denominator),
      );
      item.style.gridRowEnd = `span ${rowSpan}`;
    });
  }

  private setupAbortControllers(): void {
    this.observerAbortController = new AbortController();
    this.imageAbortController = new AbortController();

    this.observerAbortController.signal.addEventListener('abort', () => {
      this.resizeObserver?.disconnect();
      this.mutationObserver?.disconnect();
    });
  }

  private setupResizeObserver(): void {
    if (!this.container || typeof ResizeObserver === 'undefined') return;

    this.resizeObserver = new ResizeObserver(() => this.handleResize());

    this.resizeObserver.observe(this.container);
  }

  private setupMutationObserver(): void {
    if (!this.container || typeof MutationObserver === 'undefined') return;

    this.mutationObserver = new MutationObserver(() => {
      this.initializeGridItems();
      this.scheduleLayout();
    });

    this.mutationObserver.observe(this.container, {
      childList: true,
      subtree: false,
    });
  }

  private handleResize(): void {
    this.scheduleLayout();
  }

  private initializeContainerStyles(): void {
    if (!this.container) return;

    this.container.style.gridAutoRows = '1px';
    this.container.style.contain = 'layout';
    this.container.style.alignItems = 'start';
  }

  private measureContainerMetrics(): void {
    if (!this.container) return;

    const cs = getComputedStyle(this.container);

    this.rowGap = this.parseCssPixelValue(cs.rowGap);

    const parsedRowHeight = this.parseCssPixelValue(cs.gridAutoRows);

    this.rowHeight = parsedRowHeight > 0 ? parsedRowHeight : 1;
  }

  private initializeGridItems(): void {
    if (!this.container) return;

    this.gridItems = Array.from(this.container.children).filter(
      (item): item is HTMLElement => item instanceof HTMLElement,
    );

    this.gridItems.forEach((item) => {
      const images = item.querySelectorAll('img');

      images.forEach((image) => {
        this.observeImage(image);
      });
    });
  }

  private observeImage(image: HTMLImageElement): void {
    if (image.complete || this.observedImages.has(image)) return;

    this.observedImages.add(image);

    const onLoad = (): void => this.scheduleLayout();

    if (this.imageAbortController) {
      image.addEventListener('load', onLoad, {
        once: true,
        signal: this.imageAbortController.signal,
      });

      return;
    }

    image.addEventListener('load', onLoad, { once: true });
  }

  private parseCssPixelValue(value: string): number {
    const parsedValue = Number.parseFloat(value);

    return Number.isFinite(parsedValue) ? parsedValue : 0;
  }

  private storeContainerStyles(): void {
    if (!this.container) return;

    this.originalContainerStyles = {
      gridAutoRows: this.container.style.gridAutoRows || '',
      contain: this.container.style.contain || '',
      alignItems: this.container.style.alignItems || '',
    };
  }
}
