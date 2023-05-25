function $parcel$defineInteropFlag(a) {
  Object.defineProperty(a, '__esModule', {value: true, configurable: true});
}
function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$defineInteropFlag(module.exports);

$parcel$export(module.exports, "default", () => $4fa36e821943b400$export$2e2bcd8739ae039);
class $4fa36e821943b400$export$2e2bcd8739ae039 {
    constructor(){
        this.grid = null;
        this.gridItems = [];
        this.resizeObserver = null;
    }
    options(options = {}) {
        const { container: container = ".masonry"  } = options;
        this.grid = container instanceof HTMLElement ? container : document.querySelector(container);
        this.gridItems = Array.from(this.grid.children);
        this.grid.style.contain = "layout";
        this.resizeObserver = new ResizeObserver(this.resizeAllItems.bind(this));
        this.resizeObserver.observe(this.grid);
        this.resizeAllItems();
    }
    resizeItem(item, rowHeight, rowGap) {
        const rowSpan = Math.ceil((item.clientHeight + rowGap) / (rowHeight + rowGap));
        item.style.gridRowEnd = "span " + rowSpan;
    }
    resizeAllItems() {
        const rowHeight = 1;
        const rowGap = parseInt(window.getComputedStyle(this.grid).getPropertyValue("grid-row-gap"));
        this.grid.style.alignItems = "start";
        this.gridItems.forEach((item)=>this.resizeItem(item, rowHeight, rowGap));
        this.grid.style.alignItems = "stretch";
        this.gridItems.forEach((item)=>this.resizeItem(item, rowHeight, rowGap));
    }
}


//# sourceMappingURL=index.js.map
