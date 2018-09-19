import Config from './config';
import Layout from './layout';
import Compose from './compose';
import {
  flexProperties,
} from './util';

const PARENT = Symbol('parent');

class Node {
  constructor(config) {
    this.config = new Config(config, this);
    this.children = [];
  }

  get parent() {
    return this[PARENT];
  }

  set parent(node) {
    this.parent = node;
    this.config.container = node;
  }

  insertChild(node) {
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
    const layout = new Layout(this.left, this.right, this.top, this.bottom, this.width, this.height);
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