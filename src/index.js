export default class MasonrySimple {
	constructor(container) {
		this.grid = container instanceof HTMLElement ? container : document.querySelector(container)
		this.gridItems = [...this.grid.children]
		this.resizeObserver = new ResizeObserver(() => {
			this.resizeAllItems()
		})
		this.resizeObserver.observe(this.grid)

		window.onload = this.resizeAllItems.bind(this)
		window.addEventListener('beforeunload', () => {
			this.resizeObserver.unobserve(this.grid)
		})

		this.grid.style.contain = 'layout'

		this.resizeAllItems = this.debounce(this.resizeAllItems.bind(this), 200)
	}

	resizeItem(item) {
		const rowHeight = 1
		const rowGap = parseInt(window.getComputedStyle(this.grid).getPropertyValue('grid-row-gap'))
		const rowSpan = Math.ceil((item.clientHeight + rowGap) / (rowHeight + rowGap))
		item.style.gridRowEnd = 'span ' + rowSpan
	}

	resizeAllItems() {
		this.grid.style.alignItems = 'start'
		this.gridItems.forEach(item => this.resizeItem(item))
		this.grid.style.alignItems = 'stretch'
		window.requestAnimationFrame(() => {
			this.gridItems.forEach(item => this.resizeItem(item))
		})
	}

	debounce(func, wait) {
		let timeout
		return function executedFunction(...args) {
			const later = () => {
				clearTimeout(timeout)
				func(...args)
			}
			clearTimeout(timeout)
			timeout = setTimeout(later, wait)
		}
	}
}