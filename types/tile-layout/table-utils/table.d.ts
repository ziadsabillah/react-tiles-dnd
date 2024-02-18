import { GridConfig, GridCoords, GridSpan, TableOf } from '../model';
export declare const newTable: <T>(rows: number, cols: number, value: T) => TableOf<T>;
export declare const copyTable: <T>(table: TableOf<T>) => TableOf<T>;
export declare const tableSize: <T>(table: TableOf<T>) => {
    rows: number;
    cols: number;
};
export declare const isEmptyRow: <T>(row: T[]) => boolean;
export declare const trimLocation: <T>(table: TableOf<T>, { col, row }: GridCoords) => {
    col: number;
    row: number;
};
export declare const pointToLocation: <T>(table: TableOf<T>, x: number, y: number, { elementWidth, elementHeight }: GridConfig) => {
    col: number;
    row: number;
};
export declare const fitsInTable: <T>(coords: GridCoords & GridSpan, table: TableOf<T>) => boolean;
export declare const placeInTable: <T>(coords: GridCoords & GridSpan, data: T, table: TableOf<T>) => TableOf<T>;
export declare const findFirstFittingPosition: <T>(span: GridSpan, table: TableOf<T>) => GridCoords | undefined;
