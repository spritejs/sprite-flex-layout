import FlexLine from './flexLine';
import {getProp} from './util';

class Compose {
  constructor(container) {
    this.container = container;
    this.flexLines = this.parseFlexLines(container.children);
    const props = getProp(container.flexDirection);
    Object.keys(props).forEach((prop) => {
      this[prop] = props[prop];
    });
  }

  /**
   * parse flex lines by flexWrap
   * @param {Array} items flex items
   */
  parseFlexLines(items) {
    const wrap = this.container.flexWrap;
    const flexDirection = this.container.flexDirection;
    const containerPropValue = this.container[this.mainComputedSize];
    let lines = [];
    if(wrap === 'nowrap' || !containerPropValue) {
      lines = [items];
    } else {
      let line = [];
      let propValue = 0;
      items.forEach((item) => {
        const value = item[this.mainLayoutSize];
        if((propValue + value) > containerPropValue && line.length) {
          lines.push(line);
          propValue = 0;
          line = [];
        }
        propValue += value;
        line.push(item);
      });
      if(line.length) {
        lines.push(line);
        line = [];
      }
      if(wrap === 'wrap-reverse') {
        lines = lines.reverse();
      }
    }
    if(flexDirection === 'row-reverse' || flexDirection === 'column-reverse') {
      lines = lines.map((item) => {
        return item.reverse();
      });
    }
    lines = lines.map((line) => {
      return new FlexLine(line, this.container);
    });
    return lines;
  }

  /**
   * parse align-content on multiline flex lines
   */
  parseAlignContent() {
    if(this.flexLines.length === 1) return;
    const alignContent = this.container.alignContent;
    const sizeProp = this.crossComputedSize;
    const crossAxisSize = this.container[sizeProp];
    let linesCrossAxisSize = 0;
    const lineLength = this.flexLines.length;
    this.flexLines.forEach((line) => {
      linesCrossAxisSize += line.crossAxisSize;
    });
    // magin between lines
    const linesMarginSize = [];
    const leftSize = Math.max(crossAxisSize - linesCrossAxisSize, 0);
    let itemSize = 0;
    switch (alignContent) {
      case 'flex-start':
        break;
      case 'flex-end':
        linesMarginSize[0] = crossAxisSize - linesCrossAxisSize;
        break;
      case 'center':
        linesMarginSize[0] = Math.floor(leftSize / 2);
        break;
      case 'space-between':
        itemSize = Math.floor(leftSize / (lineLength - 1));
        linesMarginSize[0] = 0;
        break;
      case 'space-around':
        itemSize = Math.floor(leftSize / lineLength);
        linesMarginSize[0] = Math.floor(itemSize / 2);
        break;
      case 'space-evenly':
        itemSize = Math.floor(leftSize / (lineLength + 1));
        break;
      default: // default is stretch
        itemSize = Math.floor(leftSize / lineLength);
        linesMarginSize[0] = 0;
        break;
    }
    let crossPosition = 0;
    this.flexLines.forEach((line, index) => {
      linesMarginSize.push(itemSize);
      crossPosition += linesMarginSize[index] || 0;
      line.crossPosition = crossPosition;
      line.crossSpace = linesMarginSize[index + 1] || 0;
      crossPosition += line.crossAxisSize;
    });
  }

  parseAlignSelf() {
    if(this.flexLines.length === 1) {
      const line = this.flexLines[0];
      const crossComputedSize = this.container[this.crossComputedSize];
      line.crossSpace = crossComputedSize - line.crossAxisSize;
      line.parseAlignSelf(crossComputedSize);
    } else {
      this.flexLines.forEach((line) => {
        line.parseAlignSelf(line.crossAxisSize);
      });
    }
  }

  computeContainerSize() {
    const line = this.flexLines[0];
    const crossSize = this.container[this.crossComputedSize];
    if(!crossSize) {
      this.container[this.crossSize] = line.crossAxisSize;
    }
    const mainSize = this.container[this.mainComputedSize];
    if(!mainSize) {
      this.container[this.mainSize] = line.mainAxisSize;
    }
  }

  parseMainAxis() {
    this.flexLines.forEach((line) => {
      line.parseMainAxis();
    });
  }

  compose() {
    this.parseAlignContent();
    this.parseAlignSelf();
    this.parseMainAxis();
    this.computeContainerSize();
  }
}

export default Compose;