import {
  flexProperties,
  flexDirectionValues,
  flexWrapValues,
  justifyContentValues,
  alignItemsValues,
  alignSelfValues,
  alignContentValues,
  parseCombineValue,
  parsePercentValue,
} from './util';


class Config {
  constructor(config = {}, node) {
    this.config = {};
    this.node = node;
    Object.keys(config).forEach((item) => {
      if(!flexProperties.includes(item)) {
        throw new Error(`config ${item} is not valid`);
      }
      this[item] = config[item];
    });
  }

  parse() {
    this.parseBorder();
    this.parsePadding();
    this.parseMargin();
    this.parseFlex();
    this.parseFlexFlow();
    this.parseFlexProps();
    this.parseSize();
    this.parseComputedWidth();
    this.parseComputedHeight();
    this.parseLayoutWidth();
    this.parseLayoutHeight();
  }

  parseNumberValue(value, parentValue) {
    if(value === 'auto' || typeof value === 'number') return value;
    if(!value) return 0;
    const percentValue = parsePercentValue(value);
    if(typeof percentValue === 'number') {
      if(typeof parentValue === 'string') {
        parentValue = this.node.parent[parentValue];
      }
      value *= parentValue;
    } else if(/^[\d.]+$/.test(value)) {
      value = parseFloat(value, 10);
    } else {
      throw new Error(`${value} is not a number`);
    }
    return value;
  }

  parseBorder() {
    let border = this.border || [0, 0, 0, 0];
    if(border) {
      border = parseCombineValue(border).map((item) => {
        return this.parseNumberValue(item);
      });
    }
    const borderList = ['borderTop', 'borderRight', 'borderBottom', 'borderLeft'];
    this.border = borderList.map((item, index) => {
      this[item] = this.parseNumberValue(this[item]) || border[index];
      return this[item];
    });
  }

  parsePadding() {
    let padding = this.padding || [0, 0, 0, 0];
    if(padding) {
      padding = parseCombineValue(padding).map((item) => {
        return this.parseNumberValue(item, 'width');
      });
    }
    const paddingList = ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'];
    this.padding = paddingList.map((item, index) => {
      this[item] = this.parseNumberValue(this[item], 'width') || padding[index];
      return this[item];
    });
  }

  parseMargin() {
    let margin = this.margin || [0, 0, 0, 0];
    if(margin) {
      margin = parseCombineValue(margin).map((item) => {
        return this.parseNumberValue(item, 'width');
      });
    }
    const marginList = ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'];
    this.margin = marginList.map((item, index) => {
      this[item] = this.parseNumberValue(this[item], 'width') || margin[index];
      return this[item];
    });
  }

  parseFlex() {
    const flex = this.flex;
    if(typeof flex === 'number') {
      this.flexGrow = this.flexGrow || flex;
    }
    this.flexShrink = this.flexShrink || 1;
    this.flexGrow = this.flexGrow || 0;
    let flexBaxis = this.flexBaxis;
    if(flexBaxis) {
      const flexDirection = this.node.parent.flexDirection;
      const isRow = flexDirection === 'row' || flexDirection === 'row-reverse';
      flexBaxis = this.parseNumberValue(flexBaxis, isRow ? 'width' : 'height');
      this.flexBaxis = flexBaxis;
    }
  }

  parseSize() {
    const widths = ['width', 'minWidth', 'maxWidth'];
    widths.forEach((item) => {
      this[item] = this.parseNumberValue(this[item], 'width') || 0;
    });
    if(this.width && !this.offsetWidth) {
      this.offsetWidth = this.width;
    }
    const heights = ['height', 'minHeight', 'maxHeight'];
    heights.forEach((item) => {
      this[item] = this.parseNumberValue(this[item], 'height') || 0;
    });
    if(this.height && !this.offsetHeight) {
      this.offsetHeight = this.height;
    }
  }

  parseFlexFlow() {
    const flexFlow = this.flexFlow;
    if(flexFlow) {
      flexFlow.split(/\s+/).forEach((item) => {
        if(flexDirectionValues.includes(item)) {
          this.flexDirection = item;
        } else if(flexWrapValues.includes(item)) {
          this.flexWrap = item;
        } else {
          throw new Error(`FlexFlow: ${flexFlow} is not valid`);
        }
      });
    }
  }

  parseFlexProps() {
    const props = {
      flexDirection: flexDirectionValues,
      flexWrap: flexWrapValues,
      justifyContent: justifyContentValues,
      alignItems: alignItemsValues,
      alignSelf: alignSelfValues,
      alignContent: alignContentValues,
    };
    Object.keys(props).forEach((item) => {
      if(this[item]) {
        const allowValues = props[item];
        if(allowValues.indexOf(this[item]) === -1) {
          throw new Error(`${item} value:${this[item]} is not valid`);
        }
      } else {
        this[item] = props[item][0];
      }
    });
  }

  cacluateMargin(prop) {
    const value = this[prop];
    if(value === 'auto') return 0;
    return value;
  }

  getFlexBasis(type = 'width') {
    const flexDirection = this.node.parent.flexDirection;
    const flexBaxis = this.flexBaxis;
    if(flexBaxis && flexBaxis !== 'auto') {
      const isRow = flexDirection === 'row' || flexDirection === 'row-reverse';
      if(type === 'width' && isRow || type === 'height' && !isRow) {
        const value = this.parseNumberValue(flexBaxis, isRow ? 'width' : 'height');
        return value;
      }
    }
  }

  parseComputedWidth() {
    let width = this.getFlexBasis('width') || this.offsetWidth || 0;
    const minWidth = this.minWidth;
    let maxWidth = this.maxWidth;
    if(maxWidth && minWidth && maxWidth < minWidth) {
      maxWidth = minWidth;
    }
    if(minWidth && width < minWidth) {
      width = minWidth;
    }
    if(maxWidth && width > maxWidth) {
      width = maxWidth;
    }
    this.computedWidth = width;
  }

  parseLayoutWidth() {
    let width = this.computedWidth;

    const marginLeft = this.cacluateMargin('marginLeft');
    const marginRight = this.cacluateMargin('marginRight');
    width += marginLeft + marginRight;
    if(this.boxSizing !== 'border-box') {
      const props = ['borderLeft', 'borderRight', 'paddingLeft', 'paddingRight'];
      props.forEach((item) => {
        width += this[item] || 0;
      });
    }
    this.layoutWidth = width;
  }

  parseComputedHeight() {
    let height = this.getFlexBasis('height') || this.offsetHeight || 0;
    const minHeight = this.minHeight;
    let maxHeight = this.maxHeight;
    if(maxHeight && minHeight && maxHeight < minHeight) {
      maxHeight = minHeight;
    }
    if(minHeight && height < minHeight) {
      height = minHeight;
    }
    if(maxHeight && height > maxHeight) {
      height = maxHeight;
    }
    this.computedHeight = height;
  }

  parseLayoutHeight() {
    let height = this.computedHeight;

    const marginTop = this.cacluateMargin('marginTop');
    const marginBottom = this.cacluateMargin('marginBottom');
    height += marginTop + marginBottom;
    if(this.boxSizing !== 'border-box') {
      const props = ['borderTop', 'borderBottom', 'paddingTop', 'paddingBottom'];
      props.forEach((item) => {
        height += this[item] || 0;
      });
    }
    this.layoutHeight = height;
  }
}

export default Config;