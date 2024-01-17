class ShapeQuad extends Shape {
  /**
   * Create a quadtrilateral shape
     * @param {String} texture
     * @param {Array} vertices
     * @param {Number} zIndex
     * @param {Object} color
   * 
   */
  constructor(data) {

    super(data);
    this.type = 'quad';
    return this;
  }

  draw() {
    // if(this.texture === "color") this.getColor();
    // else texture(eval(this.texture));
    this.setTexture(this.texture);

    //this.drawBorder();
    
    //noStroke();
    const detailCount = this.texture === "color" ? 2 : 20;
    quad(this.vertices[0].x, -this.vertices[0].y, this.zIndex, this.vertices[1].x, -this.vertices[1].y, this.zIndex, this.vertices[2].x, -this.vertices[2].y, this.zIndex, this.vertices[3].x, -this.vertices[3].y, this.zIndex, detailCount, detailCount);
    
  }
}
  
  // const defaultQuad = function() {
  //   return new ShapeQuad('color', [
  //     {x: 0, y: 0},
  //     {x: 0, y: 0},
  //     {x: 0, y: 0},
  //     {x: 0, y: 0}
  //   ], -1);
  // }

  const defaultQuad = function() {
    return new ShapeQuad({
      texture: 'color', 
      vertices: [
        {x: 0, y: 0},
        {x: 0, y: 0},
        {x: 0, y: 0},
        {x: 0, y: 0}
      ],
      zIndex: -1
    });
  }
  