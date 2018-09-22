const Node = require('../lib/node').default;
const root = Node.create({
  width: 200,
  height: 400,
  flexWrap: 'wrap',
  alignContent: 'stretch',
  justifyContent: 'space-evenly',
});

const node1 = Node.create({
  width: 200,
  // height: 100,
  minWidth: 200,
});

const node2 = Node.create({
  width: 150,
  height: 100,
  minWidth: '50%',
});
// node2.marginLeft = 'auto';
// node2.flexGrow = 1;
// node2.marginTop = 10;
// node2.maxWidth = 200;

// const node3 = Node.create();
// node3.width = 200;
// node3.height = 200;

// const node4 = Node.create();
// node4.width = 110;
// node4.height = 200;

root.insertChild(node1);
root.insertChild(node2);
// root.insertChild(node3);
// root.insertChild(node4);

root.calculateLayout();
console.log(root.getComputedLayout());
// {left: 0, top: 0, width: 500, height: 300}
console.log(node1.getComputedLayout());
// {left: 150, top: 0, width: 100, height: 100}
console.log(node2.getComputedLayout());
// {left: 250, top: 0, width: 100, height: 100}
// console.log(node3.getComputedLayout());
// console.log(node4.getComputedLayout());