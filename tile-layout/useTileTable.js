import { __read, __assign } from 'tslib';
import { useState, useMemo } from 'react';
import { useDrag } from '@use-gesture/react';
import { tilesListToTable, tableToTilesList } from './table-utils/tiles-table.js';
import dragMove from './strategies/move.js';
import reorder from './strategies/reorder.js';

var useTileTable = function (_a) {
    var enabled = _a.enabled, strategy = _a.strategy, elementWidth = _a.elementWidth, elementHeight = _a.elementHeight, activeBorderSize = _a.activeBorderSize, columns = _a.columns, currentTiles = _a.currentTiles, canAcceptDrop = _a.canAcceptDrop, changeTilesOrder = _a.changeTilesOrder, didDrop = _a.didDrop;
    var strategyImpl = strategy === 'reorder' ? reorder : dragMove;
    var _b = __read(useState({
        dragging: false,
        droppable: false,
    }), 2), state = _b[0], setState = _b[1];
    //the tile layout table
    var draggingTiles = state.tiles, dragging = state.dragging, insertionPoint = state.insertionPoint;
    var effectiveTiles = (enabled && dragging && draggingTiles) || currentTiles;
    var table = useMemo(function () { return tilesListToTable(effectiveTiles, columns); }, [effectiveTiles, columns]);
    var positionedTiles = useMemo(function () { return tableToTilesList(table); }, [table]);
    var config = {
        elementHeight: elementHeight,
        elementWidth: elementWidth,
        activeBorderSize: activeBorderSize,
        columns: columns,
    };
    var bind = useDrag(function (_a) {
        var _b = __read(_a.args, 1), data = _b[0], dragging = _a.dragging, tap = _a.tap, xy = _a.xy, movement = _a.movement, event = _a.event;
        if (dragging) {
            if (!tap) {
                event.preventDefault();
                event.stopPropagation();
            }
            //if this is the first event, initialize the dragging
            if (!state.dragging) {
                var rect = event.currentTarget.getBoundingClientRect();
                //identify the hit tile
                var draggingTile_1 = positionedTiles.find(function (tile) { return tile.data === data; });
                if (!draggingTile_1)
                    return;
                setState({
                    dragging: true,
                    droppable: false,
                    tiles: positionedTiles,
                    draggingTile: draggingTile_1,
                    dragPosition: { x: xy[0] - rect.x, y: xy[1] - rect.y },
                    offset: { x: movement[0], y: movement[1] },
                    start: { col: draggingTile_1.col, row: draggingTile_1.row },
                });
            }
            else {
                var result_1 = strategyImpl.onDragMove({
                    offsetX: movement[0],
                    offsetY: movement[1],
                    canAcceptDrop: canAcceptDrop,
                    config: config,
                    state: state,
                    table: table,
                }) || {};
                setState(function (state) { return (__assign(__assign(__assign({}, state), { offset: { x: movement[0], y: movement[1] }, dropTargetTile: undefined, droppable: false, insertionPoint: undefined }), result_1)); });
            }
        }
        else {
            if (state.draggingTile && state.dropTargetTile && state.droppable) {
                didDrop(state.draggingTile, state.dropTargetTile);
            }
            else {
                var result = strategyImpl.onDragEnd({
                    offsetX: movement[0],
                    offsetY: movement[1],
                    canAcceptDrop: canAcceptDrop,
                    config: config,
                    state: state,
                    table: table,
                }) || {};
                var finalState = __assign(__assign({}, state), result);
                finalState.tiles && changeTilesOrder(finalState.tiles);
            }
            setState({
                dragging: false,
                droppable: false,
            });
        }
    }, { filterTaps: true, enabled: enabled });
    var renderTileProps = useMemo(function () {
        if (!enabled) {
            return positionedTiles
                .map(function (tile) { return (__assign(__assign({}, tile), { tileWidth: elementWidth, tileHeight: elementHeight, isDragging: false, isDropTarget: false, isDroppable: false, isDroppableAtInsertPosition: false, insertAtLeft: false, insertAtRight: false, x: tile.col * elementWidth, y: tile.row * elementHeight })); })
                .sort(function (a, b) { return a.key - b.key; });
        }
        else
            return positionedTiles
                .map(function (tile) {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
                return __assign(__assign({}, tile), { tileWidth: elementWidth, tileHeight: elementHeight, isDragging: tile.data === ((_a = state.draggingTile) === null || _a === void 0 ? void 0 : _a.data), isDropTarget: tile.data === ((_b = state.dropTargetTile) === null || _b === void 0 ? void 0 : _b.data), insertAtLeft: tile.data === ((_d = (_c = state.insertionPoint) === null || _c === void 0 ? void 0 : _c.left) === null || _d === void 0 ? void 0 : _d.data), insertAtRight: tile.data === ((_f = (_e = state.insertionPoint) === null || _e === void 0 ? void 0 : _e.right) === null || _f === void 0 ? void 0 : _f.data), isDroppable: tile.data === ((_g = state.draggingTile) === null || _g === void 0 ? void 0 : _g.data) && state.droppable, isDroppableAtInsertPosition: !!(tile.data === ((_h = state.draggingTile) === null || _h === void 0 ? void 0 : _h.data) && state.insertionPoint), x: tile.data === ((_j = state.draggingTile) === null || _j === void 0 ? void 0 : _j.data)
                        ? (((_k = state.start) === null || _k === void 0 ? void 0 : _k.col) || 0) * elementWidth +
                            (((_l = state.offset) === null || _l === void 0 ? void 0 : _l.x) || 0)
                        : tile.col * elementWidth, y: tile.data === ((_m = state.draggingTile) === null || _m === void 0 ? void 0 : _m.data)
                        ? (((_o = state.start) === null || _o === void 0 ? void 0 : _o.row) || 0) * elementHeight +
                            (((_p = state.offset) === null || _p === void 0 ? void 0 : _p.y) || 0)
                        : tile.row * elementHeight });
            })
                .sort(function (a, b) { return a.key - b.key; });
    }, [state, positionedTiles, elementHeight, elementWidth, enabled]);
    var draggingTile = state.draggingTile;
    var insertIndicatorPosition = useMemo(function () {
        var _a = insertionPoint || {}, left = _a.left, right = _a.right;
        if (left)
            return {
                x: (left.col + left.colSpan) * elementWidth,
                y: left.row * elementHeight,
            };
        if (right)
            return {
                x: right.col * elementWidth,
                y: right.row * elementHeight,
            };
        if (draggingTile)
            return {
                x: draggingTile.col * elementWidth,
                y: draggingTile.row * elementHeight,
            };
    }, [insertionPoint, elementHeight, elementWidth, draggingTile]);
    return {
        table: table,
        tableHeight: table.length * elementHeight,
        tiles: positionedTiles,
        insertIndicatorPosition: insertIndicatorPosition,
        bind: enabled ? bind : undefined,
        renderTileProps: renderTileProps,
    };
};

export { useTileTable };
//# sourceMappingURL=useTileTable.js.map
