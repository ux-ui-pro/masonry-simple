<div align="center">
<br>

<h1>masonry-simple</h1>

[![npm](https://img.shields.io/npm/v/masonry-simple.svg?colorB=brightgreen)](https://www.npmjs.com/package/masonry-simple)
[![GitHub package version](https://img.shields.io/github/package-json/v/ux-ui-pro/masonry-simple.svg)](https://github.com/ux-ui-pro/masonry-simple)
[![NPM Downloads](https://img.shields.io/npm/dm/masonry-simple.svg?style=flat)](https://www.npmjs.org/package/masonry-simple)

<sup>600B gzipped</sup>
<h3><a href="https://l6nln6.csb.app/">Demo</a></h3>

</div>
<br>

### Installation
```
$ yarn add masonry-simple
```
<br>

### Import
```javascript
import MasonrySimple from 'masonry-simple'
```
<br>

### Usage
```javascript
const masonry = MasonrySimple.init({
  container: masonryRef.value
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
```SCSS
.masonry {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-auto-flow: dense;
  grid-gap: 10px;
}
```
<br>

### Destroy
```javascript
masonry.destroy()
```
<br>

### License
<sup>masonry-simple is released under MIT license</sup>