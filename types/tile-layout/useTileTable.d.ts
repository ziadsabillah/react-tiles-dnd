import { TileInfo, TilePositionInfo, RenderTileProps } from './model';
interface TileTableDNDProps<T> {
    strategy: 'reorder' | 'move';
    enabled: boolean;
    elementWidth: number;
    elementHeight: number;
    activeBorderSize: number;
    columns: number;
    currentTiles: TileInfo<T>[];
    canAcceptDrop: (draggingTile: TileInfo<T>, targetTile: TileInfo<T>) => boolean;
    didDrop: (draggingTile: TileInfo<T>, targetTile: TileInfo<T>) => void;
    changeTilesOrder: (tiles: TileInfo<T>[]) => void;
}
export declare const useTileTable: <T>({ enabled, strategy, elementWidth, elementHeight, activeBorderSize, columns, currentTiles, canAcceptDrop, changeTilesOrder, didDrop, }: TileTableDNDProps<T>) => {
    table: import("./model").TilesTable<T>;
    tableHeight: number;
    tiles: TilePositionInfo<T>[];
    insertIndicatorPosition: {
        x: number;
        y: number;
    } | undefined;
    bind: ((...args: any[]) => import("@use-gesture/react").ReactDOMAttributes) | undefined;
    renderTileProps: (RenderTileProps<T> & {
        x: number;
        y: number;
        key: number;
    })[];
};
export {};
