import FlexLine from './flexLine';
import {getProp} from './util';

class Compose {
  constructor(container) {
    this.container = container;
    this.flexLines = this.parseFlexLines(container.children);
    const props = getProp(this.container.flexDirection);
    this.mainLayoutSize = props.mainLayoutSize;
    this.mainSize = props.mainSize;
    this.mainPos = props.mainPos;
    this.crossSize = props.crossSize;
  }

  /**
   * parse flex lines by flexWrap
   * @param {Array} items flex items
   */
  parseFlexLines(items) {
    const wrap = this.container.flexWrap;
    const flexDirection = this.container.flexDirection;
    let lines = [];
    if(wrap === 'nowrap') {
      lines = [items];
    } else {
      const prop = this.mainLayoutSize;
      const containerProp = this.mainSize;
      let line = [];
      const containerPropValue = this.container[containerProp];
      let propValue = 0;
      items.forEach((item) => {
        const value = item[prop];
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
      return new FlexLine(line, {flexDirection});
    });
    return lines;
  }

  /**
   * parse align-content on multiline flex lines
   */
  parseAlignContent() {
    if(this.flexLines.length === 1) return;
    const alignContent = this.container.alignContent;
    const sizeProp = this.crossSize;
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
      crossPosition += linesMarginSize[index];
      line.crossPosition = crossPosition;
      crossPosition += line.crossAxisSize;
    });
  }

  parseAlignSelf() {
    if(this.flexLines.length === 1) {
      this.flexLines[0].parseAlignSelf(this.container[this.crossSize]);
    } else {
      this.flexLines.forEach((line) => {
        line.parseAlignSelf(line.crossAxisSize);
      });
    }
  }

  compose() {
    this.parseAlignContent();
    this.parseAlignSelf();
  }
}

export default Compose;