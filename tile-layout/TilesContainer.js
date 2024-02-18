import { __rest, __read, __assign } from 'tslib';
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useTileTable } from './useTileTable.js';
import { useMeasure } from 'react-use';
import styles from './TilesContainer.module.css.js';
import { useComposeRef } from '../utils/useComposedRef.js';
import { jc } from '../utils/joinclasses.js';
import { isEqual } from 'lodash-es';

var TileUI = React.memo(function (_a) {
    var renderTile = _a.renderTile, props = __rest(_a, ["renderTile"]);
    return renderTile(props);
});
var isTilesContainerForcedSizeProps = function (props) { return !!props.forceTileWidth; };
var isTilesContainerColsProps = function (props) { return !!props.columns; };
var defaultTileSize = function () { return ({ rowSpan: 1, colSpan: 1 }); };
var lastKey = 0;
var dataWithKeys = function (data, dataWithKeys) {
    return data.map(function (item) {
        var existingItem = dataWithKeys.find(function (k) { return k.item === item; });
        return existingItem || { item: item, key: lastKey++ };
    });
};
var TilesContainer = function (props) {
    var containerRef = useRef(null);
    var _a = __read(useMeasure(), 2), measureRef = _a[0], measure = _a[1];
    var forceTileWidth = isTilesContainerForcedSizeProps(props)
        ? props.forceTileWidth
        : 0;
    var columns = isTilesContainerColsProps(props)
        ? props.columns
        : forceTileWidth
            ? Math.floor(measure.width / forceTileWidth)
            : 4;
    var onReorderTiles = props.onReorderTiles, _b = props.ratio, ratio = _b === void 0 ? 1 : _b, forceTileHeight = props.forceTileHeight, propsData = props.data, acceptsDrop = props.acceptsDrop, onTileDrop = props.onTileDrop, _c = props.tileSize, tileSize = _c === void 0 ? defaultTileSize : _c, renderTile = props.renderTile, renderInsertIndicator = props.renderInsertIndicator, _d = props.activeBorderSize, activeBorderSize = _d === void 0 ? 24 : _d, disabled = props.disabled, _e = props.strategy, strategy = _e === void 0 ? 'move' : _e;
    var tileWidth = forceTileWidth || measure.width / columns;
    var tileHeight = forceTileHeight || tileWidth / ratio;
    var _f = __read(useState(function () {
        return dataWithKeys(propsData, []);
    }), 2), data = _f[0], setData = _f[1];
    useEffect(function () { return setData(function (curr) { return dataWithKeys(propsData, curr); }); }, [propsData, setData]);
    //extract the tiles from the props
    var propsTiles = useMemo(function () {
        var tiles = [];
        data.forEach(function (_a) {
            var tile = _a.item, key = _a.key;
            return tiles.push(__assign(__assign({ key: key }, tileSize(tile)), { data: tile }));
        });
        return tiles;
    }, [data, tileSize]);
    var _g = useTileTable({
        columns: columns,
        strategy: strategy,
        enabled: !disabled,
        elementHeight: tileHeight,
        elementWidth: tileWidth,
        activeBorderSize: activeBorderSize,
        currentTiles: propsTiles,
        canAcceptDrop: function (source, target) {
            return acceptsDrop ? acceptsDrop(source.data, target.data) : false;
        },
        changeTilesOrder: function (tiles) {
            var newData = tiles.map(function (tile) { return tile.data; });
            var actualData = data.map(function (tile) { return tile.item; });
            if (!isEqual(actualData, newData)) {
                setData(function (curr) { return dataWithKeys(newData, curr); });
                onReorderTiles && onReorderTiles(newData);
            }
        },
        didDrop: function (source, target) {
            setData(function (tiles) { return tiles.filter(function (tile) { return tile.item !== source.data; }); });
            onTileDrop && onTileDrop(source.data, target.data);
        },
    }), bind = _g.bind, renderTileProps = _g.renderTileProps, tableHeight = _g.tableHeight, insertIndicatorPosition = _g.insertIndicatorPosition;
    var insertIndicator = useMemo(function () {
        if (!insertIndicatorPosition || !renderInsertIndicator) {
            return null;
        }
        var x = insertIndicatorPosition.x, y = insertIndicatorPosition.y;
        return (React.createElement("div", { className: styles.indicator, style: {
                top: y + "px",
                left: x + "px",
                height: tileHeight + "px",
                width: tileWidth + "px",
            } }, renderInsertIndicator()));
    }, [insertIndicatorPosition, renderInsertIndicator, tileHeight, tileWidth]);
    var tiles = useMemo(function () {
        return renderTileProps.map(function (_a) {
            var x = _a.x, y = _a.y, key = _a.key, props = __rest(_a, ["x", "y", "key"]);
            return (React.createElement("div", __assign({ className: jc(styles.tile, props.isDragging && styles.dragging), key: "K-" + key, style: {
                    top: y + "px",
                    left: x + "px",
                    width: props.colSpan * tileWidth + "px",
                    height: props.rowSpan * tileHeight + "px",
                } }, bind ? __assign({}, bind(key)) : {}),
                React.createElement(TileUI, __assign({}, props, { renderTile: renderTile }))));
        });
    }, [renderTileProps, renderTile, bind, tileWidth, tileHeight]);
    return (React.createElement("div", { className: styles.container, ref: useComposeRef(containerRef, measureRef), style: { height: tableHeight + "px", minWidth: tileWidth + "px" } },
        insertIndicator,
        tiles));
};

export { TilesContainer };
//# sourceMappingURL=TilesContainer.js.map
