import type { FUniver } from "@univerjs/core/facade";
import type { WorkbookState } from "../core/workbook.ts";
/** The Univer facade with the sheets part loaded (`@univerjs/sheets/facade`). */
export type SheetsAPI = FUniver;
/** What the student has in the table now, in the package's own format. */
export declare const readWorkbook: (api: SheetsAPI) => WorkbookState;
/**
 * After the student finishes typing in a cell: `2,5` becomes the number 2.5, and a formula in the textbook notation
 * (`=IF(A1>2,5;"так";"ні")`) becomes one the engine computes.
 */
export declare const fixUkrainianInput: (api: SheetsAPI, sheetId: string, row: number, column: number) => void;
