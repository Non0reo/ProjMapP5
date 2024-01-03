class ShapeQuad {
    /**
     * Create a quadtrilateral shape
     * @param {PImage} texture
     * @param {Array} vertices
     * @param {Number} zIndex
     * 
     */
    constructor(texture, vertices, zIndex = shapes.length) {
      for (let vertex of vertices) {
        vertex['parent'] = zIndex;
      }
      this.vertices = vertices;
      this.zIndex = zIndex;
      this.texture = texture;
      this.debugColor = {r: parseInt(Math.random() * 128 + 128), g: parseInt(Math.random() * 128 + 128), b: parseInt(Math.random() * 128 + 128)};
    }
  
    draw() {
      if(this.texture === "color") this.getColor();
      else texture(this.texture);
  
      /* beginShape();
      //console.log(this.vertices);
      for (let i = 0; i < this.vertices.length; i++) {
        //vertex(this.vertices[i][0], this.vertices[i][1], this.zIndex, this.vertices[i][0], this.vertices[i][1]);
        vertex(this.vertices[i].x, -this.vertices[i].y, this.zIndex, this.vertices[i].x, this.vertices[i].y);
      }
      endShape(CLOSE); */
      quad(this.vertices[0].x, -this.vertices[0].y, this.zIndex, this.vertices[1].x, -this.vertices[1].y, this.zIndex, this.vertices[2].x, -this.vertices[2].y, this.zIndex, this.vertices[3].x, -this.vertices[3].y, this.zIndex);
    }

    drawEdit() {
      // for (let i = 0; i < this.vertices.length; i++) {
      //     let vertex = this.vertices[i];
      //     let nextVertex = this.vertices[(i + 1) % this.vertices.length];
      //     line(vertex.x, -vertex.y, this.zIndex, nextVertex.x, -nextVertex.y, this.zIndex);
      //     fill(255, 0, 0);
      //     ellipse(vertex.x, -vertex.y, 10, 10);
      //     fill(0, 0, 0);
      // }

      for (let vertex of this.vertices) {
        this.getColor();
        ellipse(vertex.x, -vertex.y, 10, 10);
        fill(0, 0, 0);
        ellipse(vertex.x, -vertex.y, 8, 8);
        this.getColor();
        ellipse(vertex.x, -vertex.y, 5, 5);
        fill(0, 0, 0);
      }
      
      this.getColor('stroke');
      strokeWeight(8);
      noFill();
      this.draw();
      stroke(0, 0, 0);
      strokeWeight(1);

    }
  
    isMouseOver() { //Taken from https://github.com/bmoren/p5.collide2D/blob/master/p5.collide2d.js#L282
      let px = mouseX;
      let py = mouseY;
      let vertices = this.vertices;
      let collision = false;
    
      // go through each of the vertices, plus the next vertex in the list
      let next = 0;
      for (let current = 0; current < vertices.length; current++) {
    
        // get next vertex in list if we've hit the end, wrap around to 0
        next = current + 1;
        if (next === vertices.length) next = 0;
    
        // get the PVectors at our current position this makes our if statement a little cleaner
        var vc = vertices[current];    // c for "current"
        var vn = vertices[next];       // n for "next"
    
        // compare position, flip 'collision' variable back and forth
        if (((vc.y >= py && vn.y < py) || (vc.y < py && vn.y >= py)) &&
             (px < (vn.x-vc.x)*(py-vc.y) / (vn.y-vc.y)+vc.x)) {
                collision = !collision;
        }
      }
      return collision;
    }

    getColor(type = 'fill'){
        if(type === 'fill') fill(this.debugColor.r, this.debugColor.g, this.debugColor.b);
        else if(type === 'stroke') stroke(this.debugColor.r, this.debugColor.g, this.debugColor.b);
    }
  }
  
  const defaultQuad = function() {
    return new ShapeQuad('color', [
      {x: 0, y: 0},
      {x: 0, y: 0},
      {x: 0, y: 0},
      {x: 0, y: 0}
    ], -1);
  }
  