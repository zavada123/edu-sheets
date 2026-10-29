/** What the student typed into a cell. A string that starts with `=` is a formula. */
export type CellInput = string | number | boolean;
/** The part of cell formatting that school tasks talk about. Colors are `#rrggbb`. */
export interface CellStyle {
    readonly bold?: boolean;
    readonly italic?: boolean;
    readonly underline?: boolean;
    readonly strike?: boolean;
    readonly color?: string;
    readonly fill?: string;
    readonly align?: "left" | "center" | "right";
    readonly wrap?: boolean;
    readonly fontSize?: number;
    /** Number format pattern as Excel writes it: `0.00`, `0%`, `#,##0 ₴`. */
    readonly format?: string;
}
export interface CellState {
    readonly input: CellInput;
    readonly style?: CellStyle;
}
export interface SheetState {
    readonly name: string;
    /** Non-empty cells by address: `{ A1: { input: "Назва" }, C2: { input: "=A2*B2" } }`. */
    readonly cells: Readonly<Record<string, CellState>>;
    /** Column widths in pixels by column letter: `{ A: 160 }`. Other columns keep the default width. */
    readonly widths?: Readonly<Record<string, number>>;
}
/** The whole table: what a task starts with and what the student hands in. */
export interface WorkbookState {
    readonly sheets: ReadonlyArray<SheetState>;
}
/** A start sheet as an author writes it: a cell is a value, or a value with formatting. */
export interface SheetSpec {
    /** Default: «Аркуш1», «Аркуш2»… */
    readonly name?: string;
    readonly cells: Readonly<Record<string, CellInput | CellState>>;
    readonly widths?: Readonly<Record<string, number>>;
}
export declare const DEFAULT_SHEET = "\u0410\u0440\u043A\u0443\u04481";
export declare const sheetSpecName: (spec: SheetSpec, index: number) => string;
/** The start workbook of a task. */
export declare const buildWorkbook: (specs: ReadonlyArray<SheetSpec>) => WorkbookState;
export declare const isFormula: (input: CellInput) => input is string;
export declare const findSheet: (workbook: WorkbookState, name: string | undefined) => SheetState | undefined;
export declare const cellOf: (sheet: SheetState | undefined, address: string) => CellState | undefined;
/** A copy of the workbook with new inputs in some cells: `{ B2: 100 }`. Formatting stays. */
export declare const withInputs: (workbook: WorkbookState, sheetName: string | undefined, inputs: Readonly<Record<string, CellInput>>) => WorkbookState;
/** Limits for a handed-in workbook. A school task needs far less; the server refuses more. */
export declare const LIMITS: {
    readonly sheets: 10;
    readonly cells: 5000;
    readonly input: 2000;
};
/** Checks a workbook that came from outside (a saved answer) before the server reads it. */
export declare const parseWorkbook: (data: unknown) => WorkbookState | null;
/** Column letter of an address or a range start: `C7` → `C`. */
export declare const columnOf: (address: string) => string;
/** All cells of the ranges in a goal: `"B2:B6"` or `["B2", "D2:D3"]`. */
export declare const cellsIn: (ranges: string | ReadonlyArray<string>) => ReadonlyArray<string>;
