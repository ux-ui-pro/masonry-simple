export default class MasonrySimple {
	constructor() {
		this.grid = null
		this.gridItems = []
		this.resizeObserver = null
	}

	options(options = {}) {
		const {
			container = '.masonry',
		} = options

		this.grid = container instanceof HTMLElement ? container : document.querySelector(container)

		if (!this.grid) return

		this.gridItems = Array.from(this.grid.children)
		this.grid.style.contain = 'layout'
		this.resizeObserver = new ResizeObserver(this.resizeAllItems.bind(this))
		this.resizeObserver.observe(this.grid)
		this.resizeAllItems()
	}

	resizeItem(item, rowHeight, rowGap) {
		const rowSpan = Math.ceil((item.clientHeight + rowGap) / (rowHeight + rowGap))
		item.style.gridRowEnd = 'span ' + rowSpan
	}

	resizeAllItems() {
		let rowHeight = 1

		const rowGap = parseInt(window.getComputedStyle(this.grid).getPropertyValue('grid-row-gap'))

		this.grid.style.alignItems = 'start'
		this.gridItems.forEach(item => this.resizeItem(item, rowHeight, rowGap))

		const newHeight = this.gridItems[0].offsetHeight + rowGap

		if (rowHeight !== newHeight) {
			rowHeight = newHeight
			this.grid.style.alignItems = 'stretch'
			this.gridItems.forEach(item => this.resizeItem(item, rowHeight, rowGap))
		}
	}
}