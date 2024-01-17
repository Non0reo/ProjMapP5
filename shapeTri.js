class ShapeTri extends Shape {
  /**
   * Create a triangle shape
   * @param {String} texture
   * @param {Array} vertices
   * @param {Number} zIndex
   * @param {Object} color
   * 
   */
  constructor(texture, vertices, zIndex = shapes.length, color) {

      super(texture, vertices, zIndex, color);
      this.type = 'tri';
      return this;
  }

  draw() {
      this.setTexture(this.texture);

      //this.drawBorder();
      
      noStroke();
      triangle(this.vertices[0].x, -this.vertices[0].y, this.vertices[1].x, -this.vertices[1].y, this.vertices[2].x, -this.vertices[2].y);
      
  }
}
    
const defaultTri = function() {
  return new ShapeTri('color', [
    {x: 0, y: 0},
    {x: 0, y: 0},
    {x: 0, y: 0}
  ], -1);
}