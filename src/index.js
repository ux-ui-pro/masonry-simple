export default class MasonrySimple {
	constructor(options = {}) {
		const { container = '.masonry' } = options

		this.grid = null
		this.gridItems = []
		this.resizeObserver = null
		this.container = container
		this.grid =
			this.container instanceof HTMLElement
				? this.container
				: document.querySelector(this.container)

		if (!this.grid) return

		this.gridItems = this.grid.children.length
			? Array.from(this.grid.children)
			: []
		this.grid.style.contain = 'layout'
		this.resizeObserver = new ResizeObserver(
			this.resizeAllItems.bind(this)
		)
		this.resizeObserver.observe(this.grid)

		this.resizeAllItems()
	}

	resizeItem(item, rowHeight, rowGap) {
		const rowSpan = Math.ceil(
			(item.clientHeight + rowGap) / (rowHeight + rowGap)
		)

		item.style.gridRowEnd = 'span ' + rowSpan
	}

	resizeAllItems() {
		const rowHeight = 1
		const rowGap = parseInt(
			window.getComputedStyle(this.grid).getPropertyValue('grid-row-gap'),
			10
		)

		this.grid.style.alignItems = 'start'
		this.gridItems.forEach((item) =>
			this.resizeItem(item, rowHeight, rowGap)
		)
	}

	destroy() {
		if (this.resizeObserver) {
			this.resizeObserver.unobserve(this.grid)
			this.resizeObserver = null
		}

		this.grid.style.contain = ''
		this.grid.style.alignItems = ''
		this.gridItems.forEach((item) => {
			item.style.gridRowEnd = ''
		})
	}
}