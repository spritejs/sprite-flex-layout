class Layout {
  constructor(left, right, top, bottom, width, height) {
    this.left = left || 0;
    this.right = right || 0;
    this.top = top || 0;
    this.bottom = bottom || 0;
    this.width = width || 0;
    this.height = height || 0;
  }

  toString() {
    return `<Layout#${this.left}:${this.right};${this.top}:${this.bottom};${
      this.width
    }:${this.height}>`;
  }
}

export default Layout;