function unselectAllShapes() {
    console.log('unselecting all shapes');
    lastSelectedShape = defaultQuad();
    lastSelectedShapesStack = [];
    lastDraggedShape = defaultQuad();
    MovingVertex = false;
}