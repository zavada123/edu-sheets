/** Cell addresses as students write them: `B2`, `$B$2`, ranges `B2:D6`. Rows and columns start at 0 inside. */
export interface CellPos {
    readonly row: number;
    readonly col: number;
}
/** Columns up to `ZZ` (702), rows up to 10 000: much more than a school task needs. */
export declare const MAX_COL = 702;
export declare const MAX_ROW = 10000;
/** `A` → 0, `Z` → 25, `AA` → 26. */
export declare const colIndex: (letters: string) => number;
/** 0 → `A`, 26 → `AA`. */
export declare const colName: (index: number) => string;
/** `B2` → `{ row: 1, col: 1 }`; `null` for anything else. `$` signs are allowed. */
export declare const parseCell: (address: string) => CellPos | null;
export declare const cellName: ({ row, col }: CellPos) => string;
/** `B2:C3` → `B2 C2 B3 C3` (row by row); one cell → itself; `[]` for a wrong range. */
export declare const cellsOf: (range: string) => ReadonlyArray<string>;
/** Every cell the formula reads, ranges opened: `=SUM(B2:B4)*$C$1` → `B2 B3 B4 C1`. */
export declare const refsIn: (formula: string) => ReadonlySet<string>;
/** Function names in a formula, upper case: `=sum(B2:B4)+Max(C1;2)` → `SUM MAX`. */
export declare const functionsIn: (formula: string) => ReadonlySet<string>;
