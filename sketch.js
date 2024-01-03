let editMode = false;
let MovingVertex = false;
let shapes = [];
let shapesUnderMouse = [];
let lastSelectedShapesStack = [];
let lastSelectedShape = defaultQuad();
let lastDraggedShape = defaultQuad();

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  canvas = createGraphics(100, 100, P2D);

  for (let i = 0; i < 3; i++) {
    shapes.push(new ShapeQuad(canvas, [
      {x: 0, y: 0},
      {x: 100, y: 0},
      {x: 100, y: 100},
      {x: 0, y: 100}
    ]));
  }

  shapes.push(new ShapeQuad(canvas, [
    {x: 20, y: 30},
    {x: 80, y: 50},
    {x: 70, y: 80},
    {x: 10, y: 70}
  ]));
}

function draw() {
  background(0);

  canvas.background(255);
  canvas.ellipse(mouseX, mouseY, 50, 50);

  //camera(-0, 0, -100);
  translate(-width/2 , height/2, -100);
  ortho(-width / 2, width / 2, height / 2, -height / 2, 0, 10000);
  //rotate(frameCount * 0.01, [0.5, 1, 1]);
  

  for (const shape of shapes) {
    shape.draw();
    if (shape === lastSelectedShape) {
      shape.drawEdit();
    }
  }

  //elastDraggedShape = defaultQuad();
  if(mouseIsPressed && editMode) {
    for (let i = shapes.length - 1; i >= 0; i--) {
      if (/* shapes[i].isMouseOver() &&  */lastSelectedShape.zIndex === i) {
        //console.log("dragging shape " + i);
        //console.log(pmouseX - mouseX, pmouseY - mouseY)
        let dx = pmouseX - mouseX;
        let dy = pmouseY - mouseY;
        if (shapes[i].isMouseOver() && (dx > 5 || dy > 5)) lastDraggedShape = shapes[i];

          for (const vertex of shapes[i].vertices) {
            if(dist(vertex.x, vertex.y, mouseX, mouseY) < 20) {
              MovingVertex = vertex;
              break;
            }
            // vertex.x -= dx;
            // vertex.y -= dy;
          }
        
          //Make the shape follow the mouse when dragging, if a vertex is less than 10 pixels away from the mouse, move that vertex instead
          for (let j = 0; j < shapes[i].vertices.length; j++) {
            const vertex = shapes[i].vertices[j];
            if (MovingVertex === vertex) {
              console.log(j, MovingVertex)
              //MovingVertex = true;
              vertex.x = mouseX;
              vertex.y = mouseY;
              break;
            } else if(MovingVertex === false) {
              vertex.x -= dx;
              vertex.y -= dy;
            }
          }

          //MovingVertex = false;

        return;
      }
    }
  }

  if(editMode) {
    push();
      noStroke();
      fill(0, 255, 0);
      translate(width - 10, -height + 10, 0);
      plane(20, 20);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mouseReleased() {

  if (editMode) {
    let tempUnderMouse = [];
    for (let i = shapes.length - 1; i >= 0; i--) {
      if(shapes[i].isMouseOver()) tempUnderMouse.push(i);
      if(MovingVertex !== false) tempUnderMouse.push(MovingVertex.parent);
    }

    
    if(tempUnderMouse.sort().join(',') === shapesUnderMouse.sort().join(',') /* tempUnderMouse === shapesUnderMouse */) {
      console.log('1', tempUnderMouse, shapesUnderMouse);
      if(tempUnderMouse.includes(lastDraggedShape.zIndex)) return;
      for (let i = shapes.length - 1; i >= 0; i--) {
        if(!tempUnderMouse.includes(i)) continue;

        //if (shapes[i] === lastSelectedShape) continue;
        
        if (shapes[i].isMouseOver() && lastSelectedShape !== shapes[i]) {
          lastSelectedShape = shapes[i];
          if(!lastSelectedShapesStack.includes(i)) {
            lastSelectedShapesStack.push(i);
            lastSelectedShapesStack.sort();
          }
          console.log(lastSelectedShapesStack);
          MovingVertex = false;
          return;
        }
      }
      
    } else {
      console.log('2', tempUnderMouse, shapesUnderMouse);
      if(tempUnderMouse.includes(lastDraggedShape.zIndex)) return;
      if(tempUnderMouse.length > 0){
        //console.log(tempUnderMouse, tempUnderMouse.at(-1), shapes[tempUnderMouse.at(-1)])
        lastSelectedShape = shapes[tempUnderMouse.at(-1)];
        lastSelectedShapesStack = [tempUnderMouse.at(-1)];
      } else {
        lastSelectedShape = defaultQuad();
        lastDraggedShape = defaultQuad();
        lastSelectedShapesStack = [];
      }
      
      console.log(lastSelectedShapesStack);
      shapesUnderMouse = tempUnderMouse;
      MovingVertex = false;
    }
    
  }
  
}

function keyPressed() {
  switch (keyCode) {
    case 69: //E
      editMode = !editMode;
      console.log("editMode: " + editMode);
    break;

    case 27: //escape
      lastSelectedShape = defaultQuad();
      lastSelectedShapesStack = [];
      lastDraggedShape = defaultQuad();
      MovingVertex = false;
    break;
  }
}