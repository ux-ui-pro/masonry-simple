
function $parcel$defineInteropFlag(a) {
  Object.defineProperty(a, '__esModule', {value: true, configurable: true});
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$defineInteropFlag(module.exports);

$parcel$export(module.exports, "default", function () { return $a196c1ed25598f0e$export$2e2bcd8739ae039; });
class $a196c1ed25598f0e$var$MasonrySimple {
    container = null;
    gridItems = [];
    rowHeight = 1;
    rowGap = 0;
    resizeTimeout = null;
    resizeObserver;
    constructor(options = {}){
        this.container = options.container instanceof HTMLElement ? options.container : document.querySelector(options.container || ".masonry");
        this.resizeObserver = new ResizeObserver(()=>this.handleResize());
    }
    handleResize() {
        if (this.resizeTimeout !== null) window.cancelAnimationFrame(this.resizeTimeout);
        this.resizeTimeout = window.requestAnimationFrame(()=>this.resizeAllItems());
    }
    resizeAllItems() {
        if (!this.container) return;
        this.container.style.alignItems = "start";
        this.gridItems.forEach((item)=>{
            const rowSpan = Math.ceil((item.clientHeight + this.rowGap) / (this.rowHeight + this.rowGap));
            const { style: style } = item;
            style.gridRowEnd = `span ${rowSpan}`;
        });
    }
    init() {
        if (!this.container) return;
        const computedStyle = getComputedStyle(this.container);
        this.rowGap = parseInt(computedStyle.rowGap, 10);
        this.rowHeight = parseInt(computedStyle.gridAutoRows, 10) || this.rowHeight;
        this.gridItems = Array.from(this.container.children);
        this.container.style.contain = "layout";
        this.resizeObserver.observe(this.container);
        this.gridItems.forEach((item)=>this.resizeObserver.observe(item));
        this.resizeAllItems();
    }
    destroy() {
        if (!this.container) return;
        this.resizeObserver.unobserve(this.container);
        this.gridItems.forEach((item)=>this.resizeObserver.unobserve(item));
        this.container.style.contain = "";
        this.container.style.alignItems = "";
        this.gridItems.forEach((item)=>{
            const { style: style } = item;
            style.gridRowEnd = "";
        });
    }
}
var $a196c1ed25598f0e$export$2e2bcd8739ae039 = $a196c1ed25598f0e$var$MasonrySimple;


//# sourceMappingURL=index.js.map
