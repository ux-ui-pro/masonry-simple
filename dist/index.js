function $parcel$defineInteropFlag(a) {
  Object.defineProperty(a, '__esModule', {value: true, configurable: true});
}
function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$defineInteropFlag(module.exports);

$parcel$export(module.exports, "default", () => $4fa36e821943b400$export$2e2bcd8739ae039);
class $4fa36e821943b400$var$MasonrySimple {
    constructor(){
        this.grid = null;
        this.gridItems = [];
        this.resizeObserver = null;
        this.rowHeight = 1;
        this.requestAnimationFrameId = null;
        this.pendingResize = false;
    }
    resizeItem(item) {
        const rowSpan = Math.ceil((item.clientHeight + this.rowGap) / (this.rowHeight + this.rowGap));
        const newItem = item;
        newItem.style.gridRowEnd = `span ${rowSpan}`;
    }
    resizeAllItems() {
        if (this.pendingResize) return;
        this.pendingResize = true;
        if (!this.requestAnimationFrameId) this.requestAnimationFrameId = requestAnimationFrame(()=>{
            this.grid.style.alignItems = "start";
            this.gridItems.forEach((item)=>this.resizeItem(item));
            this.pendingResize = false;
            this.requestAnimationFrameId = null;
        });
    }
    static init(options = {}) {
        const { container: container = ".masonry" } = options;
        const masonry = new $4fa36e821943b400$var$MasonrySimple();
        masonry.grid = container instanceof HTMLElement ? container : document.querySelector(container);
        if (!masonry.grid) return;
        masonry.gridItems = masonry.grid.children.length ? Array.from(masonry.grid.children) : [];
        masonry.grid.style.contain = "layout";
        masonry.rowGap = parseInt(window.getComputedStyle(masonry.grid).getPropertyValue("grid-row-gap"), 10);
        masonry.resizeObserver = new ResizeObserver(masonry.resizeAllItems.bind(masonry));
        masonry.resizeObserver.observe(masonry.grid);
        masonry.resizeAllItems();
    }
    destroy() {
        if (this.resizeObserver) {
            this.resizeObserver.unobserve(this.grid);
            this.resizeObserver = null;
        }
        this.grid.style.contain = "";
        this.grid.style.alignItems = "";
        this.gridItems.forEach((item)=>{
            const newItem = item;
            newItem.style.gridRowEnd = "";
        });
    }
}
var $4fa36e821943b400$export$2e2bcd8739ae039 = $4fa36e821943b400$var$MasonrySimple;


//# sourceMappingURL=index.js.map
