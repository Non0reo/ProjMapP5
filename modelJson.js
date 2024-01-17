
/*
[
    {
        'id': zIndex,
        'texture': texture,
        'color': color,
        'vertices': [
            {
                'x': x,
                'y': y
            },
            ...
        ]
    },
]
*/

function saveScene() {
    let json = {};
    
    for (let i = 0; i < shapes.length; i++) {
        json[i] = {
            'id': shapes[i].zIndex,
            'type': shapes[i].type, // 'quad' or 'triangle'
            'texture': shapes[i].texture,
            'color': shapes[i].debugColor,
            'tags': shapes[i].tags,
            'vertices': []
        };
        for (let vertex of shapes[i].vertices) {
            json[i].vertices.push({
                'x': vertex.x,
                'y': vertex.y,
                'index': vertex.index,
                'parent': vertex.parent
            });
        }
    }

    console.log(json);
    console.log(JSON.stringify(json));
    return json;
}

function loadScene(json) {
    lastDraggedShape = defaultQuad();
    lastSelectedShape = defaultQuad();
    lastSelectedShapesStack = [];
    MovingVertex = false;

    shapes = [];

    if(typeof json !== 'object') {
        console.warn('Json is a string, parsing...')
        json = JSON.parse(json);
    }

    for (let i = 0; i < Object.keys(json).length; i++) {
        switch (json[i].type) {
            case 'quad':
                shapes.push(new ShapeQuad(json[i]));
                break;
            /* case 'triangle':
                shapes.push(new shapeTriangle(json[i].texture, json[i].vertices, json[i].id));
                break; */
        }
        console.log(i, shapes[i], shapes)
    }
}