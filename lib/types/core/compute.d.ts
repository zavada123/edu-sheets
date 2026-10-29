import type { WorkbookState } from "./workbook.ts";
/** A computed cell: a number, text, true/false, an error text such as `#DIV/0!`, or `null` for an empty cell. */
export type CellValue = number | string | boolean | null;
export interface Computed {
    /** Value of a cell on a sheet (first sheet when `sheet` is not given). */
    readonly value: (address: string, sheet?: string) => CellValue;
}
/**
 * Computes every formula of the workbook with the Univer formula engine, without a page.
 * The same engine computes the table the student sees, so the results match.
 */
export declare const compute: (workbook: WorkbookState) => Promise<Computed>;
