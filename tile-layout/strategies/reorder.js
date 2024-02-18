import { pointToLocation, tableSize } from '../table-utils/table.js';
import { getTileTouchPoint } from '../table-utils/tiles.js';

/**
 * Calculates the new table configuration while the tiles are moving
 * @param offsetX
 * @param offsetY
 * @returns
 */
var reorder = {
    onDragMove: function (_a) {
        var _b;
        var offsetX = _a.offsetX, offsetY = _a.offsetY, config = _a.config, state = _a.state, table = _a.table, canAcceptDrop = _a.canAcceptDrop;
        var elementHeight = config.elementHeight, elementWidth = config.elementWidth;
        var draggingTile = state.draggingTile, dragPosition = state.dragPosition, dropTargetTile = state.dropTargetTile, droppable = state.droppable, start = state.start, tiles = state.tiles;
        console.log('DRAG MOVE');
        if (!draggingTile || !dragPosition || !start || !tiles)
            return;
        var getInsertionPoint = function (tiles, touchPoint, touchedTile) {
            var tilePosition = tiles.findIndex(function (tile) { return tile.data === (touchedTile === null || touchedTile === void 0 ? void 0 : touchedTile.data); });
            if (touchPoint === 'left') {
                var leftTile = tilePosition - 1 >= 0 ? tiles[tilePosition - 1] : undefined;
                if (leftTile === draggingTile)
                    return undefined;
                return {
                    insertionPoint: {
                        right: touchedTile,
                        left: (leftTile === null || leftTile === void 0 ? void 0 : leftTile.row) === touchedTile.row ? leftTile : undefined,
                    },
                };
            }
            else {
                var rightTile = tilePosition + 1 < tiles.length ? tiles[tilePosition + 1] : undefined;
                if (rightTile === draggingTile)
                    return undefined;
                return {
                    insertionPoint: {
                        left: touchedTile,
                        right: (rightTile === null || rightTile === void 0 ? void 0 : rightTile.row) === touchedTile.row ? rightTile : undefined,
                    },
                };
            }
        };
        var x = start.col * elementWidth + offsetX + dragPosition.x;
        var y = start.row * elementHeight + offsetY + dragPosition.y;
        //find the position of the tile in the grid
        var cell = pointToLocation(table, x, y, config);
        var tsize = tableSize(table);
        //console.log('data:', { x, y, cell, start, draggingTile });
        //try to see if we're touching a hot point
        //find the touched tile within the move
        var touchedTile = table[cell.row][cell.col];
        if (!touchedTile || touchedTile.data === draggingTile.data)
            return;
        //get the touchpoint of the touched tile
        var touchPoint = getTileTouchPoint(touchedTile, touchedTile, {
            x: x,
            y: y,
        }, config);
        if (!touchPoint)
            return;
        //console.log('HIT TOUCHPOINT', { table, tiles });
        console.log('touch point:', touchPoint);
        if (touchPoint === 'center') {
            if (touchedTile === dropTargetTile)
                return {
                    dropTargetTile: dropTargetTile,
                    droppable: droppable,
                };
            if (canAcceptDrop(draggingTile, touchedTile))
                return {
                    dropTargetTile: touchedTile,
                    droppable: true,
                };
            return;
        }
        //apply calculation only if touching left or right areas
        if (touchPoint !== 'right' && touchPoint !== 'left')
            return;
        //if the touch point is in the bottom of the cell, pick the adjacent cell
        if (touchedTile.row !== cell.row) {
            var adjacentCol = touchPoint === 'left' ? cell.col - 1 : cell.col + touchedTile.colSpan;
            if (adjacentCol < 0 || adjacentCol > tsize.cols)
                return;
            var adjacentTile = table[cell.row][adjacentCol];
            if (!adjacentTile)
                return;
            var shiftedInsertionPoint = (_b = getInsertionPoint(tiles, touchPoint === 'left' ? 'right' : 'left', adjacentTile)) === null || _b === void 0 ? void 0 : _b.insertionPoint;
            console.log('SHIFTING: ', { shiftedInsertionPoint: shiftedInsertionPoint, touchPoint: touchPoint });
            return {
                insertionPoint: {
                    left: touchPoint === 'left' ? shiftedInsertionPoint === null || shiftedInsertionPoint === void 0 ? void 0 : shiftedInsertionPoint.right : undefined,
                    right: touchPoint === 'right' ? shiftedInsertionPoint === null || shiftedInsertionPoint === void 0 ? void 0 : shiftedInsertionPoint.left : undefined,
                },
            };
        }
        return getInsertionPoint(tiles, touchPoint, touchedTile);
    },
    onDragEnd: function (_a) {
        var state = _a.state;
        var insertionPoint = state.insertionPoint, draggingTile = state.draggingTile, tiles = state.tiles;
        console.log('Drag end start:', {
            insertionPoint: insertionPoint,
            draggingTile: draggingTile,
            tiles: tiles,
        });
        if (!tiles || !draggingTile || !insertionPoint)
            return;
        var newTiles = tiles.filter(function (tile) { return tile.data !== draggingTile.data; });
        var left = insertionPoint.left, right = insertionPoint.right;
        var insertionLeftIdx = left
            ? newTiles.findIndex(function (tile) { return tile.data === left.data; }) + 1
            : -1;
        var insertionRightIdx = right
            ? newTiles.findIndex(function (tile) { return tile.data === right.data; })
            : -1;
        var insertionIndex = insertionLeftIdx > 0 ? insertionLeftIdx : insertionRightIdx;
        if (insertionIndex < 0)
            newTiles.push(draggingTile);
        else {
            newTiles.splice(insertionIndex, 0, draggingTile);
        }
        console.log('Drag end:', {
            insertionPoint: insertionPoint,
            insertionLeftIdx: insertionLeftIdx,
            insertionRightIdx: insertionRightIdx,
            draggingTile: draggingTile,
            tiles: tiles,
            newTiles: newTiles,
        });
        return { tiles: newTiles };
    },
};

export default reorder;
//# sourceMappingURL=reorder.js.map
