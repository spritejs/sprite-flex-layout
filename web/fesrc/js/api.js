import Sync from './sync.js';

const sync = new Sync({warn: true});

export const getRender = (container, items) => {
  return sync.POST('/index/render', {
    container: JSON.stringify(container),
    items: JSON.stringify(items)
  });
};
