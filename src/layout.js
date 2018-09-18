class Layout {
  constructor(left, right, top, bottom, width, height) {
    this.left = left;
    this.right = right;
    this.top = top;
    this.bottom = bottom;
    this.width = width;
    this.height = height;
  }

  toString() {
    return `<Layout#${this.left}:${this.right};${this.top}:${this.bottom};${
      this.width
    }:${this.height}>`;
  }
}

export default Layout;