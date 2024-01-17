function unselectAllShapes() {
    lastSelectedShape = defaultQuad();
    lastSelectedShapesStack = [];
    lastDraggedShape = defaultQuad();
    MovingVertex = false;
}

function setTexActive(tex) {
    //if(typeof tex === "string") tex = imgs['tex']
    if (lastSelectedShape.zIndex === -1) {
        console.warn("ERROR: No shape selected")
        return; 
    }

    if (typeof tex !== "string") return console.warn("ERROR: Plase use a string as the variable used (example: setTexActive('imgs[\"tex\"]')")

    try {
        lastSelectedShape.setTexture(tex)
    } catch (error) {
        console.error(error)
        console.warn("ERROR: Texture not found")
    }
}

function duplicateShape(shape) {
    if(typeof shape !== "object") return console.warn("ERROR: Please use an object as the variable used (example: duplicateShape(shapes[0]))");

    const randColor = {r: parseInt(Math.random() * 128 + 128), g: parseInt(Math.random() * 128 + 128), b: parseInt(Math.random() * 128 + 128)}
    let verticiesList = shape.vertices.map(v => ({x: v.x + 10, y: v.y + 10}));

    switch (shape.constructor.name) {
        case "ShapeQuad":
            return new ShapeQuad(shape.texture, verticiesList, undefined, randColor)
        case "ShapeTri":
            return new ShapeTri(shape.texture, verticiesList, undefined, randColor)
        default:
            console.warn("ERROR: Shape type not found")
            return null;
    }
}

function addTagActive(tag) {
    //if(typeof tex === "string") tex = imgs['tex']
    if (lastSelectedShape.zIndex === -1) {
        console.warn("ERROR: No shape selected")
        return; 
    }

    if (typeof tag !== "string") return console.warn("ERROR: Plase use a string as the variable used")

    try {
        console.log(lastSelectedShape.addTag(tag));
    } catch (error) {
        console.error(error)
        console.warn("ERROR: Something went wrong")
    }
}