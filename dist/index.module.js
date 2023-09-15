class $cf838c15c8b009ba$var$MasonrySimple {
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
        const masonry = new $cf838c15c8b009ba$var$MasonrySimple();
        masonry.grid = container instanceof HTMLElement ? container : document.querySelector(container);
        if (!masonry.grid) return;
        masonry.gridItems = masonry.grid.children.length ? Array.from(masonry.grid.children) : [];
        masonry.grid.style.contain = "layout";
        masonry.rowGap = parseInt(window.getComputedStyle(masonry.grid).getPropertyValue("grid-row-gap"), 10);
        masonry.resizeObserver = new ResizeObserver(masonry.resizeAllItems.bind(masonry));
        masonry.resizeObserver.observe(masonry.grid);
        masonry.resizeAllItems();
        return masonry;
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
var $cf838c15c8b009ba$export$2e2bcd8739ae039 = $cf838c15c8b009ba$var$MasonrySimple;


export {$cf838c15c8b009ba$export$2e2bcd8739ae039 as default};
//# sourceMappingURL=index.module.js.map
