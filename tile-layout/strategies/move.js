import { __assign, __spreadArray, __read } from 'tslib';
import { interceptTiles } from '../table-utils/tiles-table.js';
import { pointToLocation, tableSize, trimLocation, newTable, placeInTable, fitsInTable, findFirstFittingPosition } from '../table-utils/table.js';
import { getTileTouchPoint } from '../table-utils/tiles.js';

/**
 * Calculates the new table configuration while the tiles are moving
 * @param offsetX
 * @param offsetY
 * @returns
 */
var dragMove = {
    onDragMove: function (_a) {
        var offsetX = _a.offsetX, offsetY = _a.offsetY, config = _a.config, state = _a.state, table = _a.table, canAcceptDrop = _a.canAcceptDrop;
        var elementHeight = config.elementHeight, elementWidth = config.elementWidth, columns = config.columns;
        var draggingTile = state.draggingTile, dragPosition = state.dragPosition, dropTargetTile = state.dropTargetTile, droppable = state.droppable, start = state.start, tiles = state.tiles;
        if (!draggingTile || !dragPosition || !start || !tiles)
            return;
        var x = start.col * elementWidth + offsetX + dragPosition.x;
        var y = start.row * elementHeight + offsetY + dragPosition.y;
        //find the position of the tile in the grid
        var cell = pointToLocation(table, x, y, config);
        var tsize = tableSize(table);
        //console.log('data:', { x, y, cell, start, draggingTile });
        //try to see if we're touching a hot point
        if (cell.col <= tsize.cols && cell.row <= tsize.rows) {
            //find the touched tile within the move
            var touchedTile = table[cell.row][cell.col];
            if (!touchedTile || touchedTile.data === draggingTile.data)
                return;
            //get the touchpoint of the touched tile
            var touchPoint = getTileTouchPoint(draggingTile, touchedTile, {
                x: x,
                y: y,
            }, config);
            if (!touchPoint)
                return;
            //console.log('HIT TOUCHPOINT', { table, tiles });
            if (touchPoint === 'center') {
                if (touchedTile === dropTargetTile)
                    return {
                        dropTargetTile: dropTargetTile,
                        droppable: droppable,
                    };
                if (canAcceptDrop(draggingTile, touchedTile))
                    return { dropTargetTile: touchedTile, droppable: true };
                return;
            }
            //a touchpoint has been identified
            var rowDisplacement = Math.floor(dragPosition.y / elementHeight);
            var colDisplacement = Math.floor(dragPosition.x / elementWidth);
            //calculate the new dragged tile location. This depends on the touched side.
            var newDragTileLocation = trimLocation(table, touchPoint === 'right'
                ? {
                    col: cell.col - (draggingTile.colSpan - 1),
                    row: cell.row - rowDisplacement,
                }
                : touchPoint === 'left'
                    ? {
                        col: cell.col,
                        row: cell.row - rowDisplacement,
                    }
                    : touchPoint === 'top'
                        ? {
                            col: cell.col - colDisplacement,
                            row: cell.row,
                        }
                        : /*touchPoint === 'bottom'*/ {
                            col: cell.col - colDisplacement,
                            row: cell.row - (draggingTile.rowSpan - 1),
                        });
            /*
            console.log(
              'Effective location:',
              newDragTileLocation,
              touchedTile,
              touchPoint,
              state
            );
            */
            //identify all hover tiles (excluding ourselves)
            var hoverTiles_1 = interceptTiles(table, newDragTileLocation.row, newDragTileLocation.col, draggingTile.rowSpan, draggingTile.colSpan).filter(function (tiles) { return tiles.data !== draggingTile.data; });
            if (!hoverTiles_1.length) {
                return;
            }
            //console.log('hover tiles:', hoverTiles);
            //create a table with the remaining tiles
            var otherTiles = tiles.filter(function (tile) {
                return tile.data !== draggingTile.data &&
                    !hoverTiles_1.find(function (t) { return t.data === tile.data; });
            });
            var newDraggingTile = __assign(__assign({}, draggingTile), newDragTileLocation);
            var checkTable_1 = newTable(tsize.rows + draggingTile.rowSpan - 1, tsize.cols, 0);
            otherTiles.forEach(function (tile) {
                checkTable_1 = placeInTable(tile, 1, checkTable_1);
            });
            /*
            console.log('checktable dump:');
            checkTable.forEach(row => {
              console.log(row.join(''));
            });
            */
            //try to fit the dragging tile in the current location
            if (!fitsInTable(newDraggingTile, checkTable_1)) {
                //console.log('new drag tile does not fit');
                return;
            }
            checkTable_1 = placeInTable(newDraggingTile, 1, checkTable_1);
            /*
            console.log('checktable dump with drag tile:');
            checkTable.forEach(row => {
              console.log(row.join(''));
            });
            */
            var repositionedHoverTiles_1 = [];
            if (hoverTiles_1.find(function (tile) {
                var newPosition = findFirstFittingPosition(tile, checkTable_1);
                //console.log('fitting', { tile, newPosition });
                if (!newPosition)
                    return true;
                var repositionedTile = __assign(__assign({}, tile), newPosition);
                repositionedHoverTiles_1.push(repositionedTile);
                checkTable_1 = placeInTable(repositionedTile, 1, checkTable_1);
                return false;
            })) {
                //console.log('repositioning failed');
                return;
            }
            var reorderedTiles = __spreadArray(__spreadArray(__spreadArray([], __read(repositionedHoverTiles_1)), __read(otherTiles)), [
                newDraggingTile,
            ]).sort(function (a, b) { return a.col + a.row * columns - (b.col + b.row * columns); });
            return {
                draggingTile: newDraggingTile,
                tiles: reorderedTiles,
            };
        }
    },
    onDragEnd: function () { return undefined; },
};

export default dragMove;
//# sourceMappingURL=move.js.map
