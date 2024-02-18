import { __spreadArray, __read } from 'tslib';

var newTable = function (rows, cols, value) {
    return new Array(rows).fill(null).map(function (_) { return new Array(cols).fill(value); });
};
var copyTable = function (table) {
    return __spreadArray([], __read(table)).map(function (row) { return __spreadArray([], __read(row)); });
};
var tableSize = function (table) {
    var rows = table.length;
    var cols = rows ? table[0].length : 0;
    return { rows: rows, cols: cols };
};
var isEmptyRow = function (row) { return !row.find(function (cell) { return !!cell; }); };
var trimLocation = function (table, _a) {
    var col = _a.col, row = _a.row;
    var _b = tableSize(table), cols = _b.cols, rows = _b.rows;
    return {
        col: col < 0 ? 0 : col >= cols ? cols - 1 : col,
        row: row < 0 ? 0 : row >= rows ? rows - 1 : row,
    };
};
var pointToLocation = function (table, x, y, _a) {
    var elementWidth = _a.elementWidth, elementHeight = _a.elementHeight;
    var col = Math.floor(x / elementWidth);
    var row = Math.floor(y / elementHeight);
    return trimLocation(table, { col: col, row: row });
};
var fitsInTable = function (coords, table) {
    var _a = tableSize(table), rows = _a.rows, cols = _a.cols;
    for (var row = coords.row; row < coords.row + coords.rowSpan; row++) {
        for (var col = coords.col; col < coords.col + coords.colSpan; col++) {
            if (row > rows || col > cols)
                return false;
            if (table[row][col])
                return false;
        }
    }
    return true;
};
var placeInTable = function (coords, data, table) {
    var newTable = copyTable(table);
    for (var row = coords.row; row < coords.row + coords.rowSpan; row++) {
        for (var col = coords.col; col < coords.col + coords.colSpan; col++) {
            newTable[row][col] = data;
        }
    }
    return newTable;
};
var findFirstFittingPosition = function (span, table) {
    var _a = tableSize(table), rows = _a.rows, cols = _a.cols;
    var free = true;
    for (var tableRow = 0; tableRow <= rows - span.rowSpan; tableRow++) {
        for (var tableCol = 0; tableCol <= cols - span.colSpan; tableCol++) {
            //check if all cells are available
            free = true;
            for (var cellRow = 0; cellRow < span.rowSpan; cellRow++) {
                for (var cellCol = 0; cellCol < span.colSpan; cellCol++) {
                    free = free && !table[tableRow + cellRow][tableCol + cellCol];
                }
            }
            if (free) {
                return { row: tableRow, col: tableCol };
            }
        }
    }
};

export { copyTable, findFirstFittingPosition, fitsInTable, isEmptyRow, newTable, placeInTable, pointToLocation, tableSize, trimLocation };
//# sourceMappingURL=table.js.map
