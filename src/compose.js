import FlexLine from './flexLine';
import {
  getProp,
  parseSpaceBetween,
} from './util';

class Compose {
  constructor(container) {
    this.container = container;
    const props = getProp(container.flexDirection);
    Object.keys(props).forEach((prop) => {
      this[prop] = props[prop];
    });
    this.flexLines = this.parseFlexLines(container.children);
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
      lines = lines.map((line) => {
        return line.reverse();
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
    // margin between lines
    const space = crossAxisSize - linesCrossAxisSize;
    const linesMarginSize = parseSpaceBetween(space, alignContent, lineLength);
    let crossPosition = 0;
    this.flexLines.forEach((line, index) => {
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