import Config from './config';
import Layout from './layout';
import Compose from './compose';
import {
  flexProperties,
} from './util';


let id = 1;
class Node {
  constructor(config) {
    this.config = new Config(config, this);
    this.parent = null;
    this.children = [];
    this.id = id++;
  }

  appendChild(node) {
    if(!(node instanceof Node)) {
      throw new Error('appended Child must be instance of Node');
    }
    node.parent = this;
    this.children.push(node);
    return this;
  }

  calculateLayout(width, height, direction) {
    if(width) this.width = width;
    if(height) this.height = height;
    if(direction) this.flexDirection = direction;
    const instance = new Compose(this);
    instance.compose();
  }

  getComputedLayout() {
    const width = this.computedWidth || this.width;
    const height = this.computedHeight || this.height;
    const layout = new Layout(this.left, this.top, width, height);
    return layout;
  }

  getAllComputedLayout() {
    const layout = this.getComputedLayout();
    layout.children = this.children.sort((a, b) => {
      return a.id > b.id ? 1 : -1;
    }).map((item) => {
      return item.getComputedLayout();
    });
    return layout;
  }

  static create(config) {
    return new Node(config);
  }
}

flexProperties.forEach((property) => {
  Object.defineProperty(Node.prototype, property, {
    get() {
      return this.config[property];
    },
    set(value) {
      this.config[property] = value;
    },
  });
});

export default Node;