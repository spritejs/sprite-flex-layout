import FlexLine from './flexLine';
import {
  getProp,
  parseSpaceBetween,
  exchangeFlexProp,
} from './util';

class Compose {
  constructor(container) {
    this.container = container;
    const props = getProp(container.flexDirection);
    Object.keys(props).forEach((prop) => {
      this[prop] = props[prop];
    });
    container.children.forEach((item) => {
      item.config.parse();
    });
    container.children = this.parseOrder(container.children);
    this.flexLines = this.parseFlexLines(container.children);
  }

  parseOrder(items) {
    return items.sort((a, b) => {
      const ar = a.order | 0;
      const br = b.order | 0;
      if(a.order && b.order) return ar > br ? 1 : -1;
      if(a.order) return ar > 0 ? 1 : -1;
      if(b.order) return br > 0 ? -1 : 1;
      return a.id > b.id ? 1 : -1;
    });
  }

  /**
   * parse flex lines by flexWrap
   * @param {Array} items flex items
   */
  parseFlexLines(items) {
    const wrap = this.container.flexWrap;
    const flexDirection = this.container.flexDirection;
    const containerPropValue = this.container[this.mainSize];
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
    let alignContent = this.container.alignContent;
    const crossAxisSize = this.container[this.crossSize];
    let space = 0;
    const lineLength = this.flexLines.length;
    if(crossAxisSize) {
      let linesCrossAxisSize = 0;
      this.flexLines.forEach((line) => {
        linesCrossAxisSize += line.crossAxisSize;
      });
      // margin between lines
      space = crossAxisSize - linesCrossAxisSize;
    }
    let linesMarginSize = [];
    if(lineLength === 1) {
      this.container.alignContent = 'stretch';
      linesMarginSize = [0, space];
    } else {
      if(this.container.flexWrap === 'wrap-reverse') {
        alignContent = exchangeFlexProp(alignContent);
      }
      linesMarginSize = parseSpaceBetween(space, alignContent, lineLength);
    }
    let crossPosition = 0;
    this.flexLines.forEach((line, index) => {
      crossPosition += linesMarginSize[index] || 0;
      line.crossPosition = crossPosition;
      line.crossSpace = linesMarginSize[index + 1] || 0;
      crossPosition += line.crossAxisSize;
    });
  }

  parseAlignSelf() {
    this.flexLines.forEach((line) => {
      line.parseAlignSelf(line.crossAxisSize);
    });
  }

  computeContainerSize() {
    const line = this.flexLines[0];
    if(!this.container[this.crossSize]) {
      this.container[this.crossSize] = line.crossAxisSize;
    }
    if(!this.container[this.mainSize]) {
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