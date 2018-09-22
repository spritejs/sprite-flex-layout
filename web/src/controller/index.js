const Base = require('./base.js');
const {Node} = require('../../../lib/index.js');
module.exports = class extends Base {
  indexAction() {
    return this.display();
  }

  renderAction() {
    const container = JSON.parse(this.post('container'));
    const items = JSON.parse(this.post('items'));
    const containerNode = new Node(container);
    items.forEach((item) => {
      const node = new Node(item);
      containerNode.appendChild(node);
    });
    containerNode.calculateLayout();
    const layout = containerNode.getAllComputedLayout();
    return this.success(layout);
  }
};
