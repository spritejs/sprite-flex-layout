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

export function getProp(flexDirection) {
  if(flexDirection === 'column' || flexDirection === 'column-reverse') {
    return {
      mainLayoutSize: 'layoutHeight',
      crossLayoutSize: 'layoutWidth',
      mainSize: 'height',
      mainComputedSize: 'computedHeight',
      crossSize: 'width',
      crossComputedSize: 'computedWidth',
      mainPos: 'left',
      mainMaxSize: 'max-height',
      crossPos: 'top',
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
    mainPos: 'top',
    mainMaxSize: 'max-width',
    crossPos: 'left',
    mainMarginStart: 'marginLeft',
    mainMarginEnd: 'marginRight',
    crossMarginStart: 'marginTop',
    crossMarginEnd: 'marginBottom',
  };
}