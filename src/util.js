export const flexProperties = [
  'flex',
  'flexDirection',
  'flexWrap',
  'flexFlow',
  'justifyContent',
  'alignContent',
  'alignItems',
  'alignSelf',
  'flexShrink',
  'flexBasis',
  'maxHeight',
  'maxWidth',
  'minHeight',
  'minWidth',
  // 'aspectRatio',
  'border',
  'borderTop',
  'borderRight',
  'borderBottom',
  'borderLeft',
  'height',
  'width',
  'margin',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'overflow',
  'padding',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'boxSizing',
  'layoutWidth',
  'layoutHeight',
  'computedWidth',
  'computedHeight',
  // 'order',
];

export const flexDirectionValues = [
  'row',
  'row-reverse',
  'column',
  'column-reverse',
];

export const flexWrapValues = [
  'nowrap',
  'wrap',
  'wrap-reverse',
];

export const justifyContentValues = [
  'flex-start',
  'flex-end',
  'center',
  'space-between',
  'space-around',
  'space-evenly',
];

export const alignItemsValues = [
  'stretch',
  'flex-start',
  'flex-end',
  'center',
  'baseline',
];

export const alignSelfValues = [
  'auto',
  'stretch',
  'flex-start',
  'flex-end',
  'center',
  'baseline',
];

export const alignContentValues = [
  'stretch',
  'flex-start',
  'flex-end',
  'center',
  'space-between',
  'space-around',
  'space-evenly',
];

export function parseCombineValue(value) {
  if(!Array.isArray(value)) {
    value = [value, value, value, value];
  } else if(value.length === 1) {
    value = [value[0], value[0], value[0], value[0]];
  } else if(value.length === 2) {
    value = [value[0], value[1], value[0], value[1]];
  } else if(value.length === 3) {
    value[3] = value[1];
  }
  return value;
}

export function parsePercentValue(value) {
  if(!/%$/.test(value)) return false;
  return 0.01 * parseFloat(value, 10);
}

/**
 * parse space between items
 * @param {Number} space space size
 * @param {String} type flex-start/flex-end/...
 * @param {Number} num array size
 */
export function parseSpaceBetween(space, type, num) {
  const marginSize = [];
  const spaceFix = Math.max(space, 0);
  const fillFull = (size = 0) => {
    for(let i = marginSize.length; i < num + 1; i++) {
      marginSize[i] = size;
    }
  };
  if(type === 'flex-end') {
    marginSize[0] = space;
    fillFull();
  } else if(type === 'center') {
    const itemSize = spaceFix / 2;
    marginSize[0] = itemSize;
    fillFull();
    marginSize[num] = itemSize;
  } else if(type === 'space-between') {
    marginSize[0] = 0;
    fillFull(spaceFix / (num - 1));
    marginSize[num] = 0;
  } else if(type === 'space-around') {
    const itemSize = spaceFix / num;
    marginSize[0] = itemSize / 2;
    fillFull(itemSize);
    marginSize[num] = itemSize / 2;
  } else if(type === 'space-evenly') {
    const itemSize = spaceFix / (num + 1);
    fillFull(itemSize);
  } else if(type === 'stretch') {
    const itemSize = spaceFix / num;
    marginSize[0] = 0;
    fillFull(itemSize);
  } else { // flex-start
    fillFull();
  }
  return marginSize;
}

export function getProp(flexDirection) {
  if(flexDirection === 'column' || flexDirection === 'column-reverse') {
    return {
      mainLayoutSize: 'layoutHeight',
      crossLayoutSize: 'layoutWidth',
      mainSize: 'height',
      mainComputedSize: 'computedHeight',
      crossSize: 'width',
      crossComputedSize: 'computedWidth',
      mainPos: 'top',
      mainMaxSize: 'max-height',
      crossPos: 'left',
      mainMarginStart: 'marginTop',
      mainMarginEnd: 'marginBottom',
      crossMarginStart: 'marginLeft',
      crossMarginEnd: 'marginRight',
    };
  }
  return {
    mainLayoutSize: 'layoutWidth',
    crossLayoutSize: 'layoutHeight',
    mainSize: 'width',
    mainComputedSize: 'computedWidth',
    crossSize: 'height',
    crossComputedSize: 'computedHeight',
    mainPos: 'left',
    mainMaxSize: 'max-width',
    crossPos: 'top',
    mainMarginStart: 'marginLeft',
    mainMarginEnd: 'marginRight',
    crossMarginStart: 'marginTop',
    crossMarginEnd: 'marginBottom',
  };
}