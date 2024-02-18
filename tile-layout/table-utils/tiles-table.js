import { __assign } from 'tslib';
import { isEmptyRow, tableSize, newTable, findFirstFittingPosition, placeInTable } from './table.js';

var interceptTiles = function (table, startRow, startCol, rowSpan, colSpan) {
    var interceptTiles = [];
    var _a = tableSize(table), rows = _a.rows, cols = _a.cols;
    for (var row = startRow; row < startRow + rowSpan; row++) {
        if (row >= rows)
            continue;
        var _loop_1 = function (col) {
            if (col >= cols)
                return "continue";
            var cell = table[row][col];
            if (cell && !interceptTiles.find(function (t) { return t.data === cell.data; })) {
                interceptTiles.push(cell);
            }
        };
        for (var col = startCol; col < startCol + colSpan; col++) {
            _loop_1(col);
        }
    }
    return interceptTiles.sort(function (a, b) { return a.col + a.row * cols - (b.col + b.row * cols); });
};
var tableToTilesList = function (table) {
    var _a = tableSize(table), rows = _a.rows, cols = _a.cols;
    return interceptTiles(table, 0, 0, rows, cols);
};
var tilesListToTable = function (tiles, columns) {
    var maxRows = tiles.reduce(function (memo, tile) { return memo + tile.rowSpan; }, 0);
    var table = newTable(maxRows, columns, undefined);
    tiles.forEach(function (tile) {
        var position = findFirstFittingPosition(tile, table);
        if (position) {
            var fittedTile = __assign(__assign({}, tile), position);
            table = placeInTable(fittedTile, fittedTile, table);
        }
    });
    //trim the table
    return table.filter(function (row) { return !isEmptyRow(row); });
};

export { interceptTiles, tableToTilesList, tilesListToTable };
//# sourceMappingURL=tiles-table.js.map
