let editMode = false;
let MovingVertex = false;
let shapes = [];
let shapesUnderMouse = [];
let lastSelectedShapesStack = [];
let lastSelectedShape = defaultQuad();
let lastDraggedShape = defaultQuad();

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  screen = createGraphics(100, 100, P2D);

  for (let i = 0; i < 3; i++) {
    shapes.push(new ShapeQuad('screen', [
      {x: 0, y: 0},
      {x: 100, y: 0},
      {x: 100, y: 100},
      {x: 0, y: 100}
    ]));
  }

  shapes.push(new ShapeQuad('color', [
    {x: 20, y: 30},
    {x: 80, y: 50},
    {x: 70, y: 80},
    {x: 10, y: 70}
  ]));
}

function draw() {
  background(0);

  screen.background(255);
  screen.ellipse(mouseX, mouseY, 50, 50);

  //camera(-0, 0, -100);
  translate(-width/2 , height/2, -100);
  ortho(-width / 2, width / 2, height / 2, -height / 2, 0, 10000);
  //rotate(frameCount * 0.01, [0.5, 1, 1]);
  

  for (const shape of shapes) {
    //shape.draw();
    if(shape === lastSelectedShape && editMode) {
      //shape.drawEdit();
      shape.draw();
      shape.drawEdit();
    } else if(editMode) {
      shape.draw();
      shape.drawBorder();
      //shape.draw();
    } else {
      shape.draw();
    }
  }

  for (const shape of shapes) {
    //shape.draw();
    if(shape === lastSelectedShape && editMode) {
      //shape.drawEdit();
      //shape.draw();
      shape.drawEdit();
    }
  }


  /* for (const shape of shapes) {
    if (shape === lastSelectedShape && editMode) {
      shape.drawEdit();
    }
  } */
  /* for (let i = shapes.length - 1; i >= 0; i--) {

    if (shapes[i] === lastSelectedShape && editMode) {
      shapes[i].drawEdit();
      //shapes[i].draw();
    }
    else {
      //shapes[i].draw();
    }

    
  }
  for (const shape of shapes) {
    if(editMode) {
      shape.drawBorder();
    }
  } */

  //elastDraggedShape = defaultQuad();
  if(mouseIsPressed && editMode) {
    for (let i = shapes.length - 1; i >= 0; i--) {
      if (lastSelectedShape.zIndex === i) {

        let dx = pmouseX - mouseX;
        let dy = pmouseY - mouseY;
        if (shapes[i].isMouseOver() && (dx > 5 || dy > 5)) lastDraggedShape = shapes[i];
      
        //Make the shape follow the mouse when dragging, if a vertex is less than 10 pixels away from the mouse, move that vertex instead
        for (let j = 0; j < shapes[i].vertices.length; j++) {
          const vertex = shapes[i].vertices[j];
          if (MovingVertex === vertex) {
            vertex.x = mouseX;
            vertex.y = mouseY;
            break;
          } else if(MovingVertex === false) {
            vertex.x -= dx;
            vertex.y -= dy;
          }
        }

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

function mousePressed() {
  if(editMode) {
    for (let i = shapes.length - 1; i >= 0; i--) {
      if (lastSelectedShape.zIndex === i) {

        let pointDist = [];
        for (const vertex of shapes[i].vertices) {
          pointDist.push(dist(vertex.x, vertex.y, mouseX, mouseY));
        }

        if(Math.min(...pointDist) < 20) {
          MovingVertex = shapes[i].vertices[pointDist.indexOf(Math.min(...pointDist))];
        }

        /* for (const vertex of shapes[i].vertices) {
          if(dist(vertex.x, vertex.y, mouseX, mouseY) < 20) {
            MovingVertex = vertex;
            break;
          }
        } */

        return;
      }
    }
  }
}


function mouseReleased() {

  if (editMode) {
    let tempUnderMouse = [];
    for (let i = shapes.length - 1; i >= 0; i--) {
      if(shapes[i].isMouseOver()) tempUnderMouse.push(i);
    }
    if(MovingVertex !== false) tempUnderMouse.push(MovingVertex.parent);
    
    if(tempUnderMouse.sort().join(',') === shapesUnderMouse.sort().join(',') /* tempUnderMouse === shapesUnderMouse */) {
      if(tempUnderMouse.includes(lastDraggedShape.zIndex)) {
        MovingVertex = false;
        return;
      }

      for (let i = shapes.length - 1; i >= 0; i--) {
        if(!tempUnderMouse.includes(i)) continue;
        if (shapes[i].isMouseOver() && lastSelectedShape !== shapes[i]) {
          lastSelectedShape = shapes[i];
          if(!lastSelectedShapesStack.includes(i)) {
            lastSelectedShapesStack.push(i);
            lastSelectedShapesStack.sort();
          }
          MovingVertex = false;
          return;
        }
      }
      MovingVertex = false;

    } else {
      if(tempUnderMouse.includes(lastDraggedShape.zIndex)) {
        MovingVertex = false;
        return;
      }
      if(tempUnderMouse.length > 0){
        //console.log(tempUnderMouse, tempUnderMouse.at(-1), shapes[tempUnderMouse.at(-1)])
        lastSelectedShape = shapes[tempUnderMouse.at(-1)];
        lastSelectedShapesStack = [tempUnderMouse.at(-1)];
      } else {
        unselectAllShapes();
      }
      
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
      if(!editMode) break;
      unselectAllShapes();
    break;

    case 78: //N
      if(!editMode) break;
      shapes.push(new ShapeQuad('color', [
        {x: mouseX, y: mouseY},
        {x: mouseX + 30, y: mouseY},
        {x: mouseX + 30, y: mouseY + 30},
        {x: mouseX, y: mouseY + 30}
      ]));
    break;

    case 46: //delete
      if(!editMode) break;
      if(lastSelectedShape.zIndex !== -1) {
        console.log(lastSelectedShape.zIndex)
        shapes.splice(lastSelectedShape.zIndex, 1);
        //change the zIndex of all the shapes after the deleted shape
        for (let i = lastSelectedShape.zIndex; i < shapes.length; i++) {
          shapes[i].zIndex--;
        }
        unselectAllShapes();
      }
    break;

    case 83: //S
      let json = saveScene();
      //copy it to clipboard
      navigator.clipboard.writeText(JSON.stringify(json));
    break;

    case 76: //L
      let jsonToLoad = prompt("Paste your json here");
      if(jsonToLoad) {
        let actualScene = saveScene();
        try {
          loadScene(jsonToLoad);
        } catch (error) {
          console.error(error);
          console.warn('Json is not valid, loading last scene');
          loadScene(actualScene);
        }
      } else console.warn('No Json were pasted');

    break;
  }
}