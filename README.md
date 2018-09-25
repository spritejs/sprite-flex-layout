# sprite-flex-layout
FlexLayout for SpriteJS

## Install

```
npm install sprite-flex-layout
```

## How to use

```js
import {Node} from 'sprite-flex-layout';
const container = Node.create({
  width: 500,
  height: 500,
  flexDirection: 'row'
});
const node1 = Node.create({
  width: 100,
  height: 100
})
const node2 = Node.create({
  width: 100,
  height: 100
});

container.appendChild(node1);
container.appendChild(node2);

container.calculateLayout();
const layout = container.getAllComputedLayout();
console.log(layout);
```

## support properties

* `flex` 
* `flexDirection` 
* `flexWrap` 
* `flexFlow` 
* `justifyContent` 
* `alignContent` 
* `alignItems` 
* `alignSelf` 
* `flexShrink` 
* `flexBasis` 
* `flexGrow` 
* `maxHeight` 
* `maxWidth` 
* `minHeight` 
* `minWidth` 
* `border` 
* `borderTop` 
* `borderRight` 
* `borderBottom` 
* `borderLeft` 
* `height` 
* `width` 
* `margin` 
* `marginTop` 
* `marginRight` 
* `marginBottom` 
* `marginLeft` 
* `padding` 
* `paddingTop` 
* `paddingRight` 
* `paddingBottom` 
* `paddingLeft` 
* `boxSizing`  `content-box` | `border-box`, default is `content-box`
* `offsetWidth` 
* `offsetHeight` 
* `order`