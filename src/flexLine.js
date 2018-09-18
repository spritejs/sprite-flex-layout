class FlexLine {
  constructor(items, {flexDirection} = {}) {
    this.items = items;
    this.flexDirection = flexDirection;
  }

  /**
   * get main axis size base on flex direction
   */
  get mainAxisSize() {
    const flexDirection = this.flexDirection;
    let prop = 'layoutWidth';
    if(flexDirection === 'column' || flexDirection === 'column-reverse') {
      prop = 'layoutHeight';
    }
    let value = 0;
    this.items.forEach((item) => {
      value += item[prop];
    });
    return value;
  }

  /**
   * get cross axis size based on flex direction
   */
  get crossAxisSize() {
    const flexDirection = this.flexDirection;
    let prop = 'layoutHeight';
    if(flexDirection === 'column' || flexDirection === 'column-reverse') {
      prop = 'layoutWidth';
    }
    const values = this.items.map((item) => {
      return item[prop];
    });
    return Math.max(...values);
  }
}

export default FlexLine;