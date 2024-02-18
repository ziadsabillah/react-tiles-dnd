import { TilesTable, TilePositionInfo, TileInfo } from '../model';
export declare const interceptTiles: <T>(table: TilesTable<T>, startRow: number, startCol: number, rowSpan: number, colSpan: number) => TilePositionInfo<T>[];
export declare const tableToTilesList: <T>(table: TilesTable<T>) => TilePositionInfo<T>[];
export declare const tilesListToTable: <T>(tiles: TileInfo<T>[], columns: number) => TilesTable<T>;
