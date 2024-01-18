let editMode = false;
let MovingVertex = false;
let shapes = [];
let shapesUnderMouse = [];
let lastSelectedShapesStack = [];
let lastSelectedShape = defaultQuad();
let lastDraggedShape = defaultQuad();

let actualVideo = {
  'name': '',
  'id': null,
  'video': null,
  'chain': false,
  'duration': null,
  'fadeInTo': null,
  'fadeOutFrom': null,
  'isPlaying': false,
}
let actualWindow = {
  'shape': undefined,
  'id': null,
  'tag': null,
  'transition': 0,
}


let imgs = {};
let videos = {};
const imageList = [
  'balcony.png',
  'walls.png',
  'windowBalcony.png',
];
const videoList = [
  'dog.mp4',
  'future.mp4',
  'robot.mp4',
  'peinture.mp4',
  'espace.mp4',
  'coiffeur.mov',
];

function preload() {
  for (let image of imageList) {
    //imgs[image.replace('.png', '')] = loadImage(`assets/${image}`);
    imgs[image.slice(0, -4)] = loadImage(`https://raw.githubusercontent.com/Non0reo/ProjMapP5/main/assets/${image}`);
  }

  for (let video of videoList) {
    //remove last 4 characters from the string
    const name = video.slice(0, -4);

    //videos[name] = createVideo(`assets/videos/${video}`);
    videos[name] = createVideo(`https://raw.githubusercontent.com/Non0reo/ProjMapP5/main/assets/videos/${video}`);
    videos[name].noLoop();
    videos[name].hide();
    videos[name].autoplay(false);
    videos[name].hideControls();
    videos[name].stop();
    videos[name].onended(() => {
      endOfVideo();
      console.log('end of video')
    });

    // videos[name].hide();
    // videos[name] = createVideo(`assets/videos/${video}`);
  }
  console.log(videos);
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  screen = createGraphics(640, 480, P2D);

  // const temp = {
  //   texture: 'color',
  //   vertices: [
  //     {x: 20, y: 30},
  //     {x: 80, y: 50},
  //     {x: 70, y: 80},
  //     {x: 10, y: 70}
  //   ],
  //   tags: ['wall']
  // }

  // shapes.push(new ShapeQuad(temp));

  loadJSON('https://raw.githubusercontent.com/Non0reo/ProjMapP5/main/assets/saves/MapSave.json', loadScene);
  //loadJSON('assets/saves/MapSave.json', loadScene);
}

function draw() {
  background(120);

  //screen.background(255);
  //screen.ellipse(mouseX, mouseY, 50, 50);
  
  if(actualVideo.id !== null) {
    // console.log(actualVideo.video.time())
    screen.tint(255, 255);
    screen.image(imgs['windowBalcony'], 0, 0, screen.width, screen.height);
    if(actualVideo.isPlaying) {
      if(actualVideo.video.time() < actualVideo.fadeInTo) {
        screen.tint(255, map(actualVideo.video.time(), 0, actualVideo.fadeInTo, 0, 255));
      } else if(actualVideo.video.time() > actualVideo.fadeOutFrom) {
        screen.tint(255, map(actualVideo.video.time(), actualVideo.fadeOutFrom, actualVideo.duration, 255, 0));
      }
    }   
    screen.image(actualVideo.video, 0, 0, screen.width, screen.height);
  }
  


  //camera(-0, 0, -100);
  translate(-width/2 , height/2, 100);
  ortho(-width / 2, width / 2, height / 2, -height / 2, 0, 10000);
  //rotate(frameCount * 0.01, [0.5, 1, 1]);
  

  /* for (const shape of shapes) {
    //shape.draw();
    if(shape === lastSelectedShape && editMode) {
      //shape.drawEdit();
      
      shape.drawEdit();
      //shape.draw();
    } else if(editMode) {
      //shape.draw();
      shape.drawBorder();
      //shape.draw();
    } else {
      //shape.draw();
    }
  } */

  /* for (const shape of shapes) {
    shape.draw();
  }
 */

  noStroke();
  noFill();


  
  // for (let i = shapes.length - 1; i >= 0; i--) {
  //   //shapes[i].draw();
  //   // strokeWeight(2);
  //   // stroke(0);
  //   // shapes[i].drawLines();
  //   // shapes[i].drawBorder();
  // }

  for (const shape of shapes) {
    
    if (!editMode) shape.draw();

    strokeWeight(2);
    stroke(0);
    shape.drawLines();

    //shape.drawBorder();
    // if (shape === lastSelectedShape && editMode) {
    //   shape.drawEdit();
    // }
  }

  for (let i = shapes.length - 1; i >= 0; i--) {
    //shapes[i].drawBorder();
    if(!editMode || shapes[i] !== lastSelectedShape) continue;

    shapes[i].drawEdit();
    break;

    // if (shapes[i] === lastSelectedShape && editMode) {
    //   shapes[i].drawEdit();
    //   return;
    // }
  }

  // for (let i = shapes.length - 1; i >= 0; i--) {
  //   //shape.draw();
  //   /* if(shapes[i] === lastSelectedShape && editMode) {
  //     //shape.drawEdit();
  //     //shape.draw();
  //     //console.log(shapes[i]);
  //     shapes[i].drawEdit();
  //   } */
  //   shapes[i].drawBorder();
  //   if(shapes[i] === lastSelectedShape && editMode) {
  //     //shape.drawEdit();
  //     //shape.draw();
  //     //console.log(shapes[i]);
  //     //shapes[i].drawEdit();
  //   }
  //   //shapes[i].drawEdit();
  //   //shape.draw();
  // }




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
      shapes.push(new ShapeQuad({
        texture: 'color', 
        vertices: [
          {x: mouseX, y: mouseY},
          {x: mouseX + 30, y: mouseY},
          {x: mouseX + 30, y: mouseY + 30},
          {x: mouseX, y: mouseY + 30}
        ]}));
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

    //duplicate shape
    case 68: //D
      if(!editMode) break;
      if(lastSelectedShape.zIndex !== -1) {
        const newShape = duplicateShape(shapes[lastSelectedShape.zIndex]);
        if(newShape === null) return;
        shapes.push(newShape);
        unselectAllShapes();
        lastSelectedShape = newShape;
      }
    break;

    //o
    case 79:
      console.log('%cStarted Video Chain!', 'color: #00eeee; background-color: #000000; font-size: 20px; padding: 6px; border-radius: 10px;');
      console.log('%cExecutez dans la console la commande `stopChain()` pour stopper la boucle', 'color: #fff; background-color: #000000; font-size: 14px; padding: 6px; border-radius: 10px;');
      startNewVideo(true);
    break;

    case 38: //up arrow
      moveEveryShape('y', -1);
    break;

    case 37: //left arrow
      moveEveryShape('x', -1);
    break;

    case 39: //right arrow
      moveEveryShape('x', 1);
    break;

    case 40: //down arrow
      moveEveryShape('y', 1);
    break;

    //;
    case 186:
      scaleEveryShapes(1.1);
    break;

    //:
    case 59:
      scaleEveryShapes(1/1.1);
    break;
    
  }
}

function moveEveryShape(axis, amount) {
  if(!editMode) return;
  for (const shape of shapes) {
    if(shape === lastSelectedShape) continue;
    for (const vertex of shape.vertices) {
      if(axis === 'x') vertex.x += amount;
      else if(axis === 'y') vertex.y += amount;
    }
  }
}

//sale every shape by an amount from the origin
function scaleEveryShapes(amount) {
  if(!editMode) return;
  for (const shape of shapes) {
    if(shape === lastSelectedShape) continue;
    for (const vertex of shape.vertices) {
      vertex.x *= amount;
      vertex.y *= amount;
    }
  }
}