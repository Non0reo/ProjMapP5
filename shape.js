class Shape {
    /**
     * Base Class for a Shape
     * @param {String} texture
     * @param {Array} vertices
     * @param {Number} zIndex
     * @param {Object} color
     * 
     */
    constructor(data) {
      this.vertices = data.vertices;
      this.zIndex = data.zIndex ? data.zIndex : shapes.length;
      this.texture = data.texture ? data.texture : "color";
      this.debugColor = data.color ? data.color : {r: parseInt(Math.random() * 128 + 128), g: parseInt(Math.random() * 128 + 128), b: parseInt(Math.random() * 128 + 128)};
      this.tags = data.tags ? data.tags : [];

      for(let vertex of this.vertices) {
        vertex['index'] = this.vertices.indexOf(vertex);
        vertex['parent'] = this.zIndex;
      }
    }

    drawEdit() {

      //Corner Circles
      
      
      /* this.getColor('stroke');
      strokeWeight(15);
      this.drawLines();
      noFill();
      //this.draw();
      stroke(0, 0, 0);
      strokeWeight(1); */

      //push();

        translate(0, 0, 0);
        strokeWeight(15);
        this.getColor('stroke');
        this.drawLines();
        
        this.drawBorder();



        for (let vertex of this.vertices) {
          this.getColor();
          ellipse(vertex.x, -vertex.y, 10, 10);
          fill(0, 0, 0);
          ellipse(vertex.x, -vertex.y, 8, 8);
          this.getColor();
          ellipse(vertex.x, -vertex.y, 5, 5);
          fill(0, 0, 1000);
        }

      //pop();
    }

    drawLines() {
      push();
        translate(0, 0, -100);
        for (let i = 0; i < this.vertices.length; i++) {
          line(this.vertices[i].x, -this.vertices[i].y, this.vertices[(i + 1) % this.vertices.length].x, -this.vertices[(i + 1) % this.vertices.length].y);
        }
      pop();
        noStroke();
        noFill();
    }

    drawBorder() {
      strokeWeight(2);
      stroke(0);
      this.drawLines();
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

    setColor(r, g, b) {
      this.debugColor = {r, g, b};
    }

    setTexture(tex) {
      this.texture = tex;
      if(tex === "color") {
        this.getColor();
      }
      else {
        texture(eval(this.texture));
      }
    }

    addTag(tag) {
      this.tags.push(tag);
      return this.tags;
    }

    setIndex(index) {
    //   shapes.splice(this.zIndex, 1);
    //   this.zIndex = index;
    //   shapes.splice(index, 0, this);
    //   for (let i = 0; i < shapes.length; i++) {
    //     shapes[i].zIndex = i;
    //     for (let j = 0; j < shapes[i].vertices.length; j++) {
    //       shapes[i].vertices[j].parent = i;
    //     }
    //   }
    
        //Insert this shape at index in the shapes array, and shift all shapes after it up one index
        shapes.splice(this.zIndex, 1);
        shapes.splice(index, 0, this);
        //Update the zIndex of all shapes
        for (let i = 0; i < shapes.length; i++) {
          shapes[i].zIndex = i;
          for (let j = 0; j < shapes[i].vertices.length; j++) {
            shapes[i].vertices[j].parent = i;
          }
        }
    }
  }