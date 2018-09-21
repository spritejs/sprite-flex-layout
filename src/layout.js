class Layout {
  constructor(id, left, top, width, height) {
    this.id = id;
    this.left = left || 0;
    this.top = top || 0;
    this.width = width || 0;
    this.height = height || 0;
  }

  toString() {
    return `<Layout#${this.left};${this.top};${
      this.width
    }:${this.height}>`;
  }
}

export default Layout;