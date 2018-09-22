const path = require('path');
const fs = require('fs');
const Base = require('./base.js');
const {Node} = require('../../../lib/index.js');
const casePath = path.join(think.ROOT_PATH, '../test/case/');
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

  collectAction() {
    const container = JSON.parse(this.post('container'));
    const items = JSON.parse(this.post('items'));
    const containerNode = new Node(container);
    items.forEach((item) => {
      const node = new Node(item);
      containerNode.appendChild(node);
    });
    containerNode.calculateLayout();
    const layout = containerNode.getAllComputedLayout();
    const data = {
      container,
      items,
      result: layout
    };
    const key = think.md5(JSON.stringify(data));
    fs.writeFileSync(path.join(casePath, `${key}.json`), JSON.stringify(data, undefined, 2));
    return this.success();
  }
};
