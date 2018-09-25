import test from 'ava';
import {Node} from '../lib';
const helper = require('think-helper');
const path = require('path');
const fs = require('fs');
const casePath = path.join(__dirname, 'case');
const files = helper.getdirFiles(casePath);
files.forEach((file) => {
  test(file, (t) => {
    const data = JSON.parse(fs.readFileSync(path.join(casePath, file), 'utf8'));
    const container = Node.create(data.container);
    data.items.forEach((item) => {
      const node = Node.create(item);
      container.appendChild(node);
    });
    container.calculateLayout();
    const result = container.getAllComputedLayout();
    t.deepEqual(result, data.result);
  });
});
