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

### flex container

* `flexDirection`, support `row` | `row-reverse` | `column` | `column-reverse`, default is `row`
* `flexWrap` , support `nowrap` | `wrap` | `wrap-reverse`, default is `nowrap`
* `flexFlow`, 	`<‘flex-direction’> || <‘flex-wrap’>`
* `alignItems`, support  `stretch` | `flex-start` | `flex-end` | `center`, default is `stretch`, not support `baseline`
* `alignContent`, support `stretch` | `flex-start` | `flex-end` | `center` | `space-between` | `space-around` | `space-evenly`, default is `stretch`
* `justifyContent` , support `flex-start` | `flex-end` | `center` | `space-between` | `space-around` | `space-evenly`, default is `flex-start`
* `height`,  container height, `<length>`
* `width`, container width, `<length>`

### flex items

* `flex` , `[ <‘flex-grow’> <‘flex-shrink’>? || <‘flex-basis’> ]`
* `alignSelf`, support `auto` | `stretch` | `flex-start` | `flex-end` | `center`, default is `auto`. not support `baseline`
* `flexShrink` , `<Number>`
* `flexBasis` , `<Number>`
* `flexGrow` , `<Number>`
* `maxHeight` , support `<length>` | `<percentage>`
* `maxWidth` , support `<length>` | `<percentage>`
* `minHeight` , support `<length>` | `<percentage>`
* `minWidth` , support `<length>` | `<percentage>`
* `border`, support `[borderTop, borderRight, borderBottom, borderLeft]`
* `borderTop` , support `<length>`
* `borderRight` , support `<length>`
* `borderBottom` , support `<length>`
* `borderLeft` , support `<length>`
* `height` , support `<length>` | `<percentage>`
* `width` , support `<length>` | `<percentage>`
* `margin` , support `[marginTop, marginRight, marginBottom, marginLeft]`
* `marginTop` , support `<length>` | `<percentage>`
* `marginRight` , support `<length>` | `<percentage>`
* `marginBottom` , support `<length>` | `<percentage>`
* `marginLeft` , support `<length>` | `<percentage>`
* `padding`, support `[paddingTop, paddingRight, paddingBottom, paddingLeft]`
* `paddingTop` , support `<length>` | `<percentage>`
* `paddingRight` , support `<length>` | `<percentage>`
* `paddingBottom` , support `<length>` | `<percentage>`
* `paddingLeft`, support `<length>` | `<percentage>`
* `boxSizing`, support `content-box` | `border-box`, default is `content-box`
* `offsetWidth`, set offset width of flex item
* `offsetHeight` , set offset height of flex item
* `order`, set flex items order