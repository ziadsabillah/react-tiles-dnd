/// <reference types="react" />
import { RenderTileFunction, RenderInsertIndicatorFunction } from './model';
export interface TilesContainerBaseProps<T> {
    /**
     * width/height ration
     */
    data: T[];
    renderTile: RenderTileFunction<T>;
    renderInsertIndicator?: RenderInsertIndicatorFunction;
    ratio?: number;
    forceTileHeight?: number;
    acceptsDrop?: (source: T, target: T) => boolean;
    onTileDrop?: (source: T, target: T) => boolean;
    tileSize?: (data: T) => {
        rowSpan: number;
        colSpan: number;
    };
    disabled?: boolean;
    onReorderTiles?: (reorderedData: T[]) => void;
    activeBorderSize?: number;
    strategy?: 'reorder' | 'move';
}
export interface TilesContainerColsProps<T> extends TilesContainerBaseProps<T> {
    columns: number;
}
export interface TilesContainerForcedSizeProps<T> extends TilesContainerBaseProps<T> {
    forceTileWidth: number;
}
export declare type TilesContainerProps<T> = TilesContainerColsProps<T> | TilesContainerForcedSizeProps<T>;
export declare const TilesContainer: <T>(props: TilesContainerProps<T>) => JSX.Element;
