import {getProp} from './util';

const CROSS_AXIS_SIZE = Symbol('crossAxisSize');

class FlexLine {
  constructor(items, container) {
    this.items = items;
    this.flexDirection = container.flexDirection;
    this.alignContent = container.alignContent;
    this.crossPosition = 0;
    this.crossSpace = 0;
    const props = getProp(this.flexDirection);
    this.mainLayoutSize = props.mainLayoutSize;
    this.crossLayoutSize = props.crossLayoutSize;
    this.mainPos = props.mainPos;
    this.crossSize = props.crossSize;
    this.crossComputedSize = props.crossComputedSize;
    this.crossMarginStart = props.crossMarginStart;
    this.crossMarginEnd = props.crossMarginEnd;
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

  parseAutoCrossMargin(item, crossSize) {
    const startAuto = item[this.crossMarginStart] === 'auto';
    const endAuto = item[this.crossMarginEnd] === 'auto';
    if(startAuto || endAuto) {
      if(this.alignContent === 'stretch') {
        crossSize += this.crossSpace;
      }
      const layoutSize = item[this.crossLayoutSize];
      let size = 0;
      if(startAuto && endAuto) {
        size = (crossSize - layoutSize) / 2;
      } else if(startAuto) {
        size = crossSize - layoutSize;
      }
      item[this.mainPos] = this.crossPosition + size;
      return true;
    }
    return false;
  }

  parseItemAlignSelf(item, crossSize) {
    // has auto value in margin on cross axis
    if(this.parseAutoCrossMargin(item, crossSize)) return;

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
      case 'baseline':
        throw new Error('align-self:baseline is not support');
      default:
        break;
    }
    let pos = this.crossPosition + crossPosition;
    const marginStart = item[this.crossMarginStart];
    if(marginStart && marginStart !== 'auto') {
      pos += marginStart;
    }
    item[this.mainPos] = pos;
  }

  parseAlignSelf(crossSize = 0) {
    this.items.forEach((item) => {
      this.parseItemAlignSelf(item, crossSize);
    });
  }

  parseJustifyContent() {

  }
}

export default FlexLine;