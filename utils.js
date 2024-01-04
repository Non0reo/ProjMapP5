function unselectAllShapes() {
    lastSelectedShape = defaultQuad();
    lastSelectedShapesStack = [];
    lastDraggedShape = defaultQuad();
    MovingVertex = false;
}