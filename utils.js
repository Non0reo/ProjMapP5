let timeout = null;

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

function changeTexFor(tag, tex) {
    if (typeof tag !== "string") return console.warn("ERROR: Plase use a string for the tag used")
    if (typeof tex !== "string") return console.warn("ERROR: Plase use a string for the texture used")

    for (let i = 0; i < shapes.length; i++) {
        if(shapes[i].tags.includes(tag)) {
            shapes[i].setTexture(tex);
        }
    }
}


/* Video related */

function stopChain() {
    actualVideo.chain = false;
    endOfVideo();
}

function endOfVideo() {
    clearTimeout(timeout);
    actualVideo.isPlaying = false;
    if(actualVideo.chain) {
        startNewVideo(true);
    } else {
        actualVideo.video.stop();
        changeTexFor(actualWindow.tag, "imgs['windowBalcony']");
    }
}

function startNewVideo(chain = false) {
    clearTimeout(timeout);
    
    if(actualVideo.video !== null) {
        actualVideo.video.stop();
        changeTexFor(actualWindow.tag, "imgs['windowBalcony']"); //Replace every window with default texture
    }

    setNewVideo();
    setNewWindow();

    //get the shape with the actualWindow.tag
    actualWindow.tag = "w" + actualWindow.id;
    for (let i = 0; i < shapes.length; i++) {
        if(shapes[i].tags.includes("window") && shapes[i].tags.includes(actualWindow.tag)) {
            actualWindow.shape = shapes[i];
            break;
        }
    }

    changeTexFor(`w${actualWindow.id}`, "screen");

    const fadeLength = 2; //Fade in and out length in seconds

    //console.log(actualVideo.shape);
    actualVideo.name = videoList[actualVideo.id].slice(0, -4)
    actualVideo.video = videos[actualVideo.name];
    actualVideo.chain = chain;
    actualVideo.duration = actualVideo.video.duration();
    actualVideo.fadeInTo = fadeLength;
    actualVideo.fadeOutFrom = actualVideo.duration - fadeLength;
    actualVideo.isPlaying = true;
    actualVideo.video.play();


    timeout = setTimeout(() => {
        console.warn('Something went wrong with the video. Changing to next one...')
        endOfVideo();
    }, 70000);

    //console.log(actualVideo, actualVideo.video.duration());

    //console.log(`playing ${actualVideo.name} on window ${actualWindow.id}`)
}


function chainVideos(bool) {
    if(bool === undefined) actualVideo.chain = !actualVideo.chain;
    else actualVideo.chain = bool;
    console.warn("Chain videos: " + actualVideo.chain);
}



function windowCount() {
    let windows = 0;
    for (let i = 0; i < shapes.length; i++) {
        if(shapes[i].tags.includes("window")) windows++;
    }
    return windows;
}

function setNewVideo() {
    //Pick random video id
    if(actualVideo.id === null) {
        actualVideo.id = Math.floor(Math.random() * Object.keys(videos).length);
    } 
    /* else {
        let random;
        do {
            random = Math.floor(Math.random() * Object.keys(videos).length);
        } while (actualVideo.id === random);
        actualVideo.id = random;
    } */
    else {
        actualVideo.id++;
        if(actualVideo.id >= Object.keys(videos).length) actualVideo.id = 0;
    }
}

function setNewWindow() {
    //Pick random window id
    if(actualWindow.id === null) {
        actualWindow.id = Math.floor(Math.random() * windowCount());
    } else {
        let random;
        do {
            random = Math.floor(Math.random() * windowCount());
        } while (actualWindow.id === random);
        actualWindow.id = random;
    }
}