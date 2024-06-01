<div align="center">
<br>

<h1>masonry-simple</h1>

<p><sup>MasonrySimple implements a simple system for placing masonry style elements using CSS Grid. Masonry placement is used for dynamic grids where elements may have different heights and need to be placed neatly without gaps.</sup></p>

[![npm](https://img.shields.io/npm/v/masonry-simple.svg?colorB=brightgreen)](https://www.npmjs.com/package/masonry-simple)
[![GitHub package version](https://img.shields.io/github/package-json/v/ux-ui-pro/masonry-simple.svg)](https://github.com/ux-ui-pro/masonry-simple)
[![NPM Downloads](https://img.shields.io/npm/dm/masonry-simple.svg?style=flat)](https://www.npmjs.org/package/masonry-simple)

<sup>600B gzipped</sup>

<a href="https://codepen.io/ux-ui/pen/poxGEqX">Demo</a>

</div>
<br>

&#10148; **Install**
```console
$ yarn add masonry-simple
```
<br>

&#10148; **Import**
```javascript
import MasonrySimple from 'masonry-simple';
```
<br>

&#10148; **Usage**
```javascript
const masonry = new MasonrySimple({
  container: '.masonry',
});

masonry.init();
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

&#10148; **Destroy**
```javascript
masonry.destroy();
```
<br>

&#10148; **License**

masonry-simple is released under MIT license
