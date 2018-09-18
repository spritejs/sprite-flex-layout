import {
  flexProperties,
  flexDirectionValues,
  flexWrapValues,
  justifyContentValues,
  alignItemsValues,
  alignSelfValues,
  alignContentValues,
  parseCombineValue,
} from './util';


// const LAYOUT_WIDTH = Symbol('layoutWidth');
// const LAYOUT_HEIGHT = Symbol('layoutHeight');

class Config {
  constructor(config = {}) {
    this.config = {};
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

  get position() {
    return [this.top, this.right, this.bottom, this.left];
  }

  set position(value) {
    value = parseCombineValue(value);
    this.top = value[0];
    this.right = value[1];
    this.bottom = value[2];
    this.left = value[3];
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

  /**
   * @TODO
   */
  set flex(value) {
    this.config._flex = value;
    return this;
  }

  get layoutWidth() {
    // if(this[LAYOUT_WIDTH]) return this[LAYOUT_WIDTH];
    let width = this.width || 0;
    const minWidth = this.minWidth || 0;
    const maxWidth = this.maxWidth || 0;
    if(minWidth && width < minWidth) {
      width = minWidth;
    }
    if(maxWidth && width > maxWidth) {
      width = maxWidth;
    }

    const props = ['marginLeft', 'marginRight'];
    if(this.boxSizing !== 'border-box') {
      props.push('borderLeft', 'borderRight', 'paddingLeft', 'paddingRight');
    }
    let value = 0;
    props.forEach((item) => {
      value += this[item] || 0;
    });
    // this[LAYOUT_WIDTH] = width + value;
    return width + value;
  }

  get layoutHeight() {
    // if(this[LAYOUT_HEIGHT]) return this[LAYOUT_HEIGHT];
    let height = this.height || 0;
    const minHeight = this.minHeight || 0;
    const maxHeight = this.maxHeight || 0;
    if(minHeight && height < minHeight) {
      height = minHeight;
    }
    if(maxHeight && height > maxHeight) {
      height = maxHeight;
    }

    const props = ['marginTop', 'marginBottom'];
    if(this.boxSizing !== 'border-box') {
      props.push('borderTop', 'borderBottom', 'paddingTop', 'paddingBottom');
    }
    let value = 0;
    props.forEach((item) => {
      value += this[item] || 0;
    });
    // this[LAYOUT_HEIGHT] = height + value;
    return height + value;
  }

  get flexFlow() {
    return this.config._flexFlow;
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
    this.config._flexFlow = value;
    return this;
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

export default Config;