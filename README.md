# masonry-simple

A lightweight masonry layout helper built on top of CSS Grid.

- Idempotent lifecycle: `init()`, `refresh()`, `destroy()`.
- Unified layout scheduling for resize, mutations, image load, and manual refresh.
- Safe teardown with observer/listener cleanup and inline-style restoration.
- Supports dynamic image content and responsive CSS changes.

## Install

```bash
yarn add masonry-simple
```

## Usage (TypeScript)

```ts
import MasonrySimple from 'masonry-simple';

const masonry = new MasonrySimple({
  container: '.masonry',
});

masonry.init();
```

## Usage (Vue 3)

```vue
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, shallowRef } from 'vue';
import MasonrySimple from 'masonry-simple';

const masonryRef = ref<HTMLElement | null>(null);
const masonry = shallowRef<MasonrySimple | null>(null);

onMounted(() => {
  if (!masonryRef.value) return;
  masonry.value = new MasonrySimple({ container: masonryRef.value });
  masonry.value.init();
});

onBeforeUnmount(() => {
  masonry.value?.destroy();
  masonry.value = null;
});
</script>

<template>
  <div ref="masonryRef" class="masonry">
    <div class="masonry__item">...</div>
    <div class="masonry__item">...</div>
  </div>
</template>
```

## HTML Layout

```html
<div class="masonry">
  <div class="masonry__item">
    <img src="/img/1.jpg" alt="">
  </div>
  <div class="masonry__item">
    Lorem ipsum
  </div>
</div>
```

## CSS Contract

```css
.masonry {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 12px;
}
```

- Container must use CSS Grid.
- Item heights are measured from rendered content.
- Library temporarily applies inline styles while active:
  - `gridAutoRows: 1px`
  - `contain: layout`
  - `alignItems: start`
- These inline styles are restored on `destroy()`.

## Options

| Option      | Type                     | Default      | Description                                       |
|:------------|:-------------------------|:------------:|:--------------------------------------------------|
| `container` | `HTMLElement \| string`  | `'.masonry'` | Target container element or selector.             |

## Methods

```ts
masonry.init();
masonry.refresh();
masonry.destroy();
```

## Lifecycle Behavior

- `init()` is idempotent and does not duplicate observers/listeners.
- `refresh()` re-collects grid items and schedules a single layout pass.
- `destroy()` cancels scheduled animation frame work, disconnects observers, clears listeners, and resets item styles (`gridRowEnd`).
- `refresh()` after `destroy()` is a safe no-op.

## Edge Cases and Limitations

- Missing container: methods do nothing.
- SSR / non-DOM environments: graceful no-op behavior when `document` is unavailable.
- Missing `ResizeObserver` / `MutationObserver`: layout still works via manual `refresh()`.
- Hidden container (`display: none`) or zero-size state may produce temporary fallback spans.
- If size changes happen without child mutations, call `refresh()` manually.

## Performance Notes

- Batch DOM changes and call one `refresh()`.
- Avoid frequent style mutations during animation loops.
- Prefer known image dimensions to reduce post-load relayout work.

## License

MIT
