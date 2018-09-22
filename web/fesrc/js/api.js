import Sync from './sync.js';

const sync = new Sync({warn: true});

export const pv = {
  getList(type, date = '') {
    return sync.GET(`/monitor/pv?type=${type}&date=${date}&t=${Date.now()}`);
  }
};

export const referrer = {
  getList(type, date = '') {
    return sync.GET(`/monitor/referrer?type=${type}&date=${date}&t=${Date.now()}`);
  }
};

export const status = {
  getList(type, date = '') {
    return sync.GET(`/monitor/status?type=${type}&date=${date}&t=${Date.now()}`);
  }
};

export const error = {
  getList() {
    return sync.GET(`/monitor/error?t=${Date.now()}`);
  }
};
