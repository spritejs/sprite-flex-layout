import {getProp} from './util';

const CROSS_AXIS_SIZE = Symbol('crossAxisSize');

class FlexLine {
  constructor(items, {flexDirection, alignContent} = {}) {
    this.items = items;
    this.flexDirection = flexDirection;
    this.alignContent = alignContent;
    this.crossPosition = 0;
    this.crossSpace = 0;
    const props = getProp(flexDirection);
    this.mainLayoutSize = props.mainLayoutSize;
    this.crossLayoutSize = props.crossLayoutSize;
    this.mainPos = props.mainPos;
    this.crossSize = props.crossSize;
    this.crossComputedSize = props.crossComputedSize;
  }

  /**
   * get main axis size base on flex direction
   */
  get mainAxisSize() {
    let value = 0;
    this.items.forEach((item) => {
      value += item[this.mainLayoutSize];
    });
    return value;
  }

  /**
   * get cross axis size based on flex direction
   */
  get crossAxisSize() {
    if(this[CROSS_AXIS_SIZE]) return this[CROSS_AXIS_SIZE];
    const values = this.items.map((item) => {
      return item[this.crossLayoutSize];
    });
    const result = Math.max(...values);
    this[CROSS_AXIS_SIZE] = result;
    return result;
  }

  parseItemAlignSelf(item, crossSize) {
    let alignSelf = item.alignSelf;
    if(alignSelf === 'auto') {
      alignSelf = item.parent.alignSelf;
    }
    const layoutSize = item[this.crossLayoutSize];
    const itemCrossSize = item[this.crossSize];
    let crossPosition = 0;
    switch (alignSelf) {
      case 'flex-end':
        crossPosition = crossSize - layoutSize;
        break;
      case 'center':
        crossPosition = Math.floor((crossSize - layoutSize) / 2);
        break;
      case 'stretch':
        // stretch item cross size
        if(this.alignContent === 'stretch' && itemCrossSize === undefined && this.crossSpace) {
          item[this.crossSize] = item[this.crossComputedSize] + this.crossSpace;
        }
        break;
      case 'flex-start':
      case 'baseline':
        break;
      default:
        break;
    }
    item[this.mainPos] = this.crossPosition + crossPosition;
  }

  parseAlignSelf(crossSize = 0) {
    this.items.forEach((item) => {
      this.parseItemAlignSelf(item, crossSize);
    });
  }
}

export default FlexLine;