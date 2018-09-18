const Node = require('../lib/node').default;
const root = Node.create();
root.width = 500;
root.height = 300;
root.flexWrap = 'wrap';
root.justifyContent = 'center';

const node1 = Node.create();
node1.width = 200;
node1.height = 100;

const node2 = Node.create();
node2.width = 150;
node2.height = 100;

const node3 = Node.create();
node3.width = 200;
node3.height = 200;

const node4 = Node.create();
node4.width = 110;
node4.height = 200;

root.insertChild(node1);
root.insertChild(node2);
root.insertChild(node3);
root.insertChild(node4);

root.calculateLayout();
console.log(root.getComputedLayout());
// {left: 0, top: 0, width: 500, height: 300}
console.log(node1.getComputedLayout());
// {left: 150, top: 0, width: 100, height: 100}
console.log(node2.getComputedLayout());
// {left: 250, top: 0, width: 100, height: 100}