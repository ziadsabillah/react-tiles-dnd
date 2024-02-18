import { GridConfig, TilePositionInfo } from '../model';
export declare const positionedTilesMaxRows: <T>(positionedTiles: TilePositionInfo<T>[]) => number;
/**
 * Check if the elements are overlapping in the table
 *
 * @param positionedTiles
 */
export declare const checkOverlap: <T>(positionedTiles: TilePositionInfo<T>[], { columns }: GridConfig) => boolean;
export declare const getTileTouchPoint: <T>(draggingTile: TilePositionInfo<T>, targetTile: TilePositionInfo<T>, absolutePosition: {
    x: number;
    y: number;
}, { elementHeight, elementWidth, activeBorderSize }: GridConfig) => "left" | "right" | "bottom" | "top" | "center" | undefined;
export declare const tileIncludes: <T>(tile: TilePositionInfo<T>, point: {
    col: number;
    row: number;
    height: number;
}) => boolean;
