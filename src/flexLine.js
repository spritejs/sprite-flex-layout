import {getProp} from './util';

const CROSS_AXIS_SIZE = Symbol('crossAxisSize');

class FlexLine {
  constructor(items, container) {
    this.items = items;
    this.container = container;
    this.flexDirection = container.flexDirection;
    this.alignContent = container.alignContent;
    this.crossPosition = 0;
    this.crossSpace = 0;
    const props = getProp(this.flexDirection);
    Object.keys(props).forEach((prop) => {
      this[prop] = props[prop];
    });
  }

  /**
   * get main axis size base on flex direction
   */
  get mainAxisSize() {
    let value = 0;
    this.items.forEach((item) => {
      value += item[this.mainLayoutSize] || 0;
    });
    return value;
  }

  /**
   * get cross axis size based on flex direction
   */
  get crossAxisSize() {
    if(this[CROSS_AXIS_SIZE]) return this[CROSS_AXIS_SIZE];
    const values = this.items.map((item) => {
      return item[this.crossLayoutSize] || 0;
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
      item[this.crossPos] = this.crossPosition + size;
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
    const pos = this.crossPosition + crossPosition;
    item[this.crossPos] = pos + this._getMarginStart(item, this.crossMarginStart);
  }

  parseAlignSelf(crossSize = 0) {
    this.items.forEach((item) => {
      this.parseItemAlignSelf(item, crossSize);
    });
  }

  hasMarginAutoInMainAxis() {
    return this.items.some((item) => {
      return item[this.mainMarginStart] === 'auto' || item[this.mainMarginEnd] === 'auto';
    });
  }

  hasFlexGrow() {
    return this.items.some((item) => {
      return item.flexGrow;
    });
  }

  parseByFlexGrow(space) {
    let grow = 0;
    let max = 0;
    const items = [];
    this.items.forEach((item) => {
      grow += item.flexGrow || 0;
      items.push({max: item[this.mainMaxSize], grow: item.flexGrow});
      if(item[this.mainMaxSize]) {
        max++;
      }
    });
    while(true) {
      const itemSpace = space / grow;
      if(!max) {
        let flag = false;
        items.forEach((item, index) => {
          if(item.grow) {
            const increSpace = Math.round(item.grow * itemSpace);
            this.items[index][this.mainSize] = this.items[index][this.mainComputedSize] + increSpace;
            space -= increSpace;
            flag = true;
          }
        });
        if(flag) {
          space = 0;
        }
        break;
      }
      let flag = false;
      items.forEach((item, index) => {
        if(item.max && item.grow) {
          const leaveSpace = item.max - this.items[index][this.mainComputedSize];
          if(itemSpace > leaveSpace) {
            this.items[index][this.mainSize] = item.max;
            space -= leaveSpace;
            grow -= item.grow;
            delete item.max;
            delete item.grow;
            flag = true;
          }
        }
      });
      if(!grow) break;
      if(!flag) {
        max = 0;
      }
    }
    if(!space) {
      let pos = 0;
      this.items.forEach((item) => {
        item[this.mainPos] = pos + this._getMarginStart(item, this.mainMarginStart);
        pos += item[this.mainComputedSize];
      });
    }
    return parseInt(space, 10);
  }

  _getMarginStart(item, type) {
    const margin = item[type];
    if(margin && margin !== 'auto') return margin;
    return 0;
  }

  parseByMarginAuto(space) {
    let marginAutoNum = 0;
    this.items.forEach((item) => {
      if(item[this.mainMarginStart] === 'auto') {
        marginAutoNum++;
      }
      if(item[this.mainMarginEnd] === 'auto') {
        marginAutoNum++;
      }
    });
    const itemSpace = space / marginAutoNum;
    let pos = 0;
    this.items.forEach((item) => {
      let marginStart = item[this.mainMarginStart];
      if(marginStart === 'auto') {
        marginStart = itemSpace;
      }
      pos += marginStart;
      item[this.mainPos] = pos;
      pos += item[this.mainComputedSize];
      let marginEnd = item[this.mainMarginEnd];
      if(marginEnd === 'auto') {
        marginEnd = itemSpace;
      }
      pos += marginEnd;
    });
  }

  parseByJustifyContent(space) {

  }

  hasFlexShrink() {
    return this.items.some((item) => {
      return item.flexShrink;
    });
  }

  parseMainAxis() {
    const mainSize = this.container[this.mainSize];
    const mainAxisSize = this.mainAxisSize;
    let space = mainSize - mainAxisSize;
    if(space > 0) {
      if(this.hasFlexGrow()) {
        space = this.parseByFlexGrow(space);
        if(!space) return;
      }
      if(this.hasMarginAutoInMainAxis()) {
        return this.parseByMarginAuto(space);
      }
      return this.parseByJustifyContent(space);
    }
  }
}

export default FlexLine;