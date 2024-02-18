import 'tslib';

var getTileTouchPoint = function (draggingTile, targetTile, absolutePosition, _a) {
    var elementHeight = _a.elementHeight, elementWidth = _a.elementWidth, activeBorderSize = _a.activeBorderSize;
    var position = {
        x: absolutePosition.x - targetTile.col * elementWidth,
        y: absolutePosition.y - targetTile.row * elementHeight,
    };
    if (draggingTile.col >= targetTile.col && position.x < activeBorderSize)
        return 'left';
    if (draggingTile.col <= targetTile.col &&
        position.x > elementWidth * targetTile.colSpan - activeBorderSize)
        return 'right';
    if (draggingTile.row <= targetTile.row &&
        position.y > elementHeight * targetTile.rowSpan - activeBorderSize)
        return 'bottom';
    if (draggingTile.row >= targetTile.row && position.y < activeBorderSize)
        return 'top';
    if (position.x > activeBorderSize &&
        position.y < elementWidth * targetTile.colSpan - activeBorderSize &&
        position.y > activeBorderSize &&
        position.y < elementHeight * targetTile.rowSpan - activeBorderSize)
        return 'center';
};

export { getTileTouchPoint };
//# sourceMappingURL=tiles.js.map
