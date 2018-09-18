import FlexLine from './flexLine';

class Compose {
  constructor(container) {
    this.container = container;
    this.flexLines = this.parseFlexLines(container.children);
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
      let prop = 'layoutWidth';
      let containerProp = 'width';
      if(flexDirection === 'column' || flexDirection === 'column-reverse') {
        prop = 'layoutHeight';
        containerProp = 'height';
      }
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
    const flexDirection = this.container.flexDirection;
    let posProp = 'top';
    let sizeProp = 'height';
    if(flexDirection === 'column' || flexDirection === 'column-reverse') {
      posProp = 'left';
      sizeProp = 'width';
    }
    const mainAxisSize = this.container[sizeProp];
    let linesMainAxisSize = 0;
    this.flexLines.forEach((line) => {
      linesMainAxisSize += line.mainAxisSize;
    });
  }

  compose() {
    this.parseAlignContent();
  }
}

export default Compose;