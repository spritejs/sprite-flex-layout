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


// const LAYOUT_WIDTH = Symbol('layoutWidth');
// const LAYOUT_HEIGHT = Symbol('layoutHeight');

const CACLUTE_MARGIN = Symbol('caculate-margin');
const GET_FLEX_BASIS = Symbol('get-flex-basis');
const PARSE_PERCENT_VALUE = Symbol('parse-percent-value');

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

  get border() {
    return [this.borderTop, this.borderRight, this.borderBottom, this.borderLeft];
  }

  set border(value) {
    value = parseCombineValue(value);
    this.borderTop = value[0];
    this.borderRight = value[1];
    this.borderBottom = value[2];
    this.borderLeft = value[3];
  }

  get padding() {
    return [this.paddingTop, this.paddingRight, this.paddingBottom, this.paddingLeft];
  }

  set padding(value) {
    value = parseCombineValue(value);
    this.paddingTop = value[0];
    this.paddingRight = value[1];
    this.paddingBottom = value[2];
    this.paddingLeft = value[3];
  }

  get margin() {
    return [this.marginTop, this.marginRight, this.marginBottom, this.marginLeft];
  }

  set margin(value) {
    value = parseCombineValue(value);
    this.marginTop = value[0];
    this.marginRight = value[1];
    this.marginBottom = value[2];
    this.marginLeft = value[3];
  }


  get flex() {
    return this.config.flex;
  }

  set flex(value) {
    this.config.flex = value;
    if(value === 'none') return;
    if(typeof value === 'number') {
      this.flexGrow = value;
      this.flexShrink = 1;
      this.flexBaxis = '0%';
    }
  }

  get flexBaxis() {
    return this.config.flexBaxis;
  }

  set flexBaxis(value) {
    const flexDirection = this.node.parent.flexDirection;
    const isRow = flexDirection === 'row' || flexDirection === 'row-reverse';
    value = this[PARSE_PERCENT_VALUE](value, isRow ? 'width' : 'height');
    this.config.flexBaxis = value;
  }

  [PARSE_PERCENT_VALUE](value, prop = 'width') {
    if(typeof value === 'number' || !value) return value;
    const percent = parsePercentValue(value);
    if(percent) {
      let parentValue = prop;
      if(typeof prop === 'string') {
        parentValue = this.node.parent[prop];
      }
      if(!parentValue) {
        throw new Error(`parent node width & height must be set when child value is percent(${value})`);
      }
      return parentValue * percent;
    }
    throw new Error(`value:${value} must be a number`);
  }

  [CACLUTE_MARGIN](prop, parentValue) {
    let value = this[prop];
    if(value === 'auto') return 0;

    value = this[PARSE_PERCENT_VALUE](value, parentValue);
    this[prop] = value;
    return value;
  }

  [GET_FLEX_BASIS](type = 'width') {
    const flexDirection = this.node.parent.flexDirection;
    const flexBaxis = this.flexBaxis;
    if(flexBaxis && flexBaxis !== 'auto') {
      const isRow = flexDirection === 'row' || flexDirection === 'row-reverse';
      if(type === 'width' && isRow || type === 'height' && !isRow) {
        const value = this[PARSE_PERCENT_VALUE](flexBaxis, isRow ? 'width' : 'height');
        return value;
      }
    }
  }

  get layoutWidth() {
    // if(this[LAYOUT_WIDTH]) return this[LAYOUT_WIDTH];
    let width = this[GET_FLEX_BASIS]('width') || this.computedWidth || 0;
    const minWidth = this.minWidth;
    const maxWidth = this.maxWidth;
    if(minWidth && width < minWidth) {
      width = minWidth;
    }
    if(maxWidth && width > maxWidth) {
      width = maxWidth;
    }

    const props = [];
    if(this.boxSizing !== 'border-box') {
      props.push('borderLeft', 'borderRight', 'paddingLeft', 'paddingRight');
    }
    const parentWidth = this.node.parent.computedWidth;
    const marginLeft = this[CACLUTE_MARGIN]('marginLeft', parentWidth);
    const marginRight = this[CACLUTE_MARGIN]('marginRight', parentWidth);
    let value = marginLeft + marginRight;
    props.forEach((item) => {
      value += this[item] || 0;
    });
    // this[LAYOUT_WIDTH] = width + value;
    return width + value;
  }

  get layoutHeight() {
    // if(this[LAYOUT_HEIGHT]) return this[LAYOUT_HEIGHT];
    let height = this[GET_FLEX_BASIS]('height') || this.computedHeight || 0;
    const minHeight = this.minHeight || 0;
    const maxHeight = this.maxHeight || 0;
    if(minHeight && height < minHeight) {
      height = minHeight;
    }
    if(maxHeight && height > maxHeight) {
      height = maxHeight;
    }

    const props = [];
    if(this.boxSizing !== 'border-box') {
      props.push('borderTop', 'borderBottom', 'paddingTop', 'paddingBottom');
    }
    const parentHeight = this.node.parent.computedHeight;
    const marginTop = this[CACLUTE_MARGIN]('marginTop', parentHeight);
    const marginBottom = this[CACLUTE_MARGIN]('marginBottom', parentHeight);
    let value = marginTop + marginBottom;
    props.forEach((item) => {
      value += this[item] || 0;
    });
    // this[LAYOUT_HEIGHT] = height + value;
    return height + value;
  }

  get flexFlow() {
    return this.config.flexFlow;
  }

  set flexFlow(value) {
    value.split(/\s+/).forEach((item) => {
      if(!item) return;
      if(flexDirectionValues.includes(item)) {
        this.flexDirection = item;
      } else if(flexWrapValues.includes(item)) {
        this.flexWrap = item;
      } else {
        throw new Error(`FlexFlow: ${value} is not valid`);
      }
    });
    this.config.flexFlow = value;
  }

  get width() {
    return this.config.width;
  }

  set width(value) {
    value = this[PARSE_PERCENT_VALUE](value, 'width');
    this.computedWidth = value;
    this.config.width = value;
  }

  get height() {
    return this.config.height;
  }

  set height(value) {
    value = this[PARSE_PERCENT_VALUE](value, 'height');
    this.computedHeight = value;
    this.config.height = value;
  }
}

const properties = {
  flexDirection: flexDirectionValues,
  flexWrap: flexWrapValues,
  justifyContent: justifyContentValues,
  alignItems: alignItemsValues,
  alignSelf: alignSelfValues,
  alignContent: alignContentValues,
};

Object.keys(properties).forEach((property) => {
  Object.defineProperty(Config.prototype, property, {
    get() {
      return this.config[property] || properties[property][0];
    },
    set(value) {
      const allowValues = properties[property];
      if(!allowValues.includes(value)) {
        throw new Error(`${property}:${value} is not valid`);
      }
      this.config[property] = value;
    },
    enumerable: true,
    configurable: true,
  });
});


const supportPercentProps = {
  width: ['min-width', 'max-width', 'margin-left', 'margin-right', 'padding-left', 'padding-right'],
  height: ['min-height', 'max-height', 'margin-top', 'margin-bottom', 'padding-top', 'padding-bottom'],
};
Object.keys(supportPercentProps).forEach((prop) => {
  supportPercentProps[prop].forEach((item) => {
    Object.defineProperty(Config.prototype, item, {
      get() {
        return this.config[item];
      },
      set(value) {
        value = this[PARSE_PERCENT_VALUE](value, prop);
        this.config[item] = value;
      },
      enumerable: true,
      configurable: true,
    });
  });
});


export default Config;