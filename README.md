<br>
<div align="center">

# masonry-simple
The MasonrySimple class is designed to create a masonry layout of elements on a page. Vue friendly.

[![npm](https://img.shields.io/npm/v/masonry-simple.svg?colorB=brightgreen)](https://www.npmjs.com/package/masonry-simple)
[![GitHub package version](https://img.shields.io/github/package-json/v/ux-ui-pro/masonry-simple.svg)](https://github.com/ux-ui-pro/masonry-simple)
[![NPM Downloads](https://img.shields.io/npm/dm/masonry-simple.svg?style=flat)](https://www.npmjs.org/package/masonry-simple)

<sup>600B gzipped</sup>

<a href="https://l6nln6.csb.app/">codesandbox</a> / <a href="https://codepen.io/ux-ui/pen/poxGEqX">codepen</a>

</div>

<br>

&#10148; **Installation**

<sub>**Recommended**</sub>
```console
$ yarn add masonry-simple
```
<sub>**Not recommended**<br>Import the [masonry-simple.min.js](https://github.com/ux-ui-pro/masonry-simple/blob/master/dist/masonry-simple.min.js) file using the `<script>` tag. You can [download it here](https://github.com/ux-ui-pro/masonry-simple/releases/latest). In this connection method, no initialisation is required and it is mandatory to specify the `.masonry' class for the html container.</sub>
```html
<script src="path-to-the-file/masonry-simple.min.js"></script>
```
<br>

&#10148; **Import**
```javascript
import MasonrySimple from 'masonry-simple';
```
<br>

&#10148; **Usage**

<sub>The container can be specified in the following formats: a string value representing the class or id of an element in the DOM, such as '.masonry' or '#masonry'. A Vue reactive reference that contains a DOM element.</sub>

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

<sup>masonry-simple is released under MIT license</sup>
