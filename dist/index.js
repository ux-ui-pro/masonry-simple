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
        this.container = null;
        this.gridItems = [];
        this.rowHeight = 1;
        this.rowGap = 0;
        this.resizeObserver = new ResizeObserver(this.resizeAllItems.bind(this));
    }
    resizeAllItems() {
        this.container.style.alignItems = "start";
        this.gridItems.forEach((item)=>{
            const rowSpan = Math.ceil((item.clientHeight + this.rowGap) / (this.rowHeight + this.rowGap));
            const newItem = item;
            newItem.style.gridRowEnd = `span ${rowSpan}`;
        });
    }
    static init(options = {}) {
        const { container: container = ".masonry" } = options;
        const masonry = new $4fa36e821943b400$var$MasonrySimple();
        masonry.container = container instanceof HTMLElement ? container : document.querySelector(container);
        if (!masonry.container) return;
        masonry.gridItems = Array.from(masonry.container.children);
        masonry.container.style.contain = "layout";
        masonry.rowGap = parseInt(getComputedStyle(masonry.container).rowGap, 10);
        masonry.resizeObserver.observe(masonry.container);
        masonry.resizeAllItems();
        return masonry;
    }
    destroy() {
        this.resizeObserver.unobserve(this.container);
        this.container.style.contain = "";
        this.container.style.alignItems = "";
        this.gridItems.forEach((item)=>{
            const newItem = item;
            newItem.style.gridRowEnd = "";
        });
    }
}
var $4fa36e821943b400$export$2e2bcd8739ae039 = $4fa36e821943b400$var$MasonrySimple;


//# sourceMappingURL=index.js.map
