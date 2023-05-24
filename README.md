<div align="center">
<br>

<h1>masonry-simple</h1>

[![npm](https://img.shields.io/npm/v/masonry-simple.svg?colorB=brightgreen)](https://www.npmjs.com/package/masonry-simple)
[![GitHub package version](https://img.shields.io/github/package-json/v/ux-ui-pro/masonry-simple.svg)](https://github.com/ux-ui-pro/masonry-simple)
[![NPM Downloads](https://img.shields.io/npm/dm/masonry-simple.svg?style=flat)](https://www.npmjs.org/package/masonry-simple)

<sup><a href="https://bundlephobia.com/package/masonry-simple">0.7kB gzipped</a></sup>
<h3><a href="https://codepen.io/ux-ui/pen/poxGEqX">Demo</a></h3>

</div>
<br>

### Installation
```javascript
$ yarn add masonry-simple
```
<sup>or</sup>
```javascript
$ npm i masonry-simple
```
<br>

### Import
```javascript
import MasonrySimple from 'masonry-simple'
```
<br>

### Usage
```javascript
const masonry = new MasonrySimple()

masonry.options({
	container: '.masonry',
	timeout: 200
})
```
```HTML
<div class="masonry">
	<div class="masonry__item">
		...
	</div>
	<div class="masonry__item">
		...
	</div>
	...
</div>
```
<br>

### Settings
| Arg | Default | Description |
| --- | --- | --- |
| `container` | `'.masonry'` | The HTML class of the element inside which the grid elements will be located. |
| `debounce` | `200` | Sets the delay when resizing the browser window. `0` &mdash; disables the delay and allows the grid to rebuild faster. |
<br>

### License
<sup>masonry-simple is released under MIT license</sup>