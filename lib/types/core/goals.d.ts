import { type CellValue } from "./compute.ts";
import { type CellInput, type CellStyle, type WorkbookState } from "./workbook.ts";
/** Text and hint an author may set on any goal; `sheet` picks a sheet by name (default: the first). */
interface GoalBase {
    readonly text?: string;
    readonly hint?: string;
    readonly sheet?: string;
}
/** Cells as a range `"D2:D6"`, one cell `"B5"` or a list `["B5", "D2:D3"]`. */
export type Cells = string | ReadonlyArray<string>;
/**
 * Conditions a scenario checks on the final table. Authors pick them from this list, no programming needed.
 * Values are the computed ones: a formula counts by its result.
 */
export type Goal = GoalBase & ({
    /** Each cell shows this value; a list gives a value per cell, row by row. */
    readonly type: "value";
    readonly cells: Cells;
    readonly equals: CellValue | ReadonlyArray<CellValue>;
    /** Allowed difference for numbers. Default: none (rounding noise only). */
    readonly tolerance?: number;
} | {
    /** Each cell holds a formula, not a typed number. */
    readonly type: "formula";
    readonly cells: Cells;
    /** The formula must call these functions: `["SUM"]`. */
    readonly functions?: ReadonlyArray<string>;
    /** `false` allows a formula with numbers only (`=12*3`). Default: it must read other cells. */
    readonly refs?: boolean;
} | {
    /** The formulas give the right result for other data: the checker puts `set` into the cells and computes again. */
    readonly type: "recalc";
    readonly set: Readonly<Record<string, CellInput>>;
    readonly cells: Cells;
    readonly equals: CellValue | ReadonlyArray<CellValue>;
    readonly tolerance?: number;
} | {
    /** Each cell has at least this formatting; other formatting is allowed. */
    readonly type: "style";
    readonly cells: Cells;
    readonly style: CellStyle;
} | {
    readonly type: "filled";
    readonly cells: Cells;
} | {
    /** Rows of the range are ordered by a column and stayed whole (a row was not split while sorting). */
    readonly type: "sorted";
    readonly range: string;
    readonly by: string;
    readonly order?: "asc" | "desc";
} | {
    readonly type: "width";
    readonly column: string;
    readonly min: number;
} | {
    readonly type: "sheet";
    readonly name: string;
});
export interface GoalResult {
    readonly goal: Goal;
    readonly ok: boolean;
    /** What the student sees in the task list. */
    readonly text: string;
    /** Shown only when the condition is not met. */
    readonly hint: string;
}
export declare const formatValue: (value: CellValue) => string;
/** Default wording of a goal for the task list. */
export declare const describeGoal: (goal: Goal) => string;
/** In a style goal, `color: "*"` or `fill: "*"` accepts any color the student chose. */
export declare const ANY = "*";
/** Default Univer column width; a goal on width counts a column the student never touched as this wide. */
export declare const DEFAULT_WIDTH = 88;
/** Checks every goal on the final table. `start` is the task's start table (for goals that compare with it). */
export declare const checkGoals: (start: WorkbookState, final: WorkbookState, goals: ReadonlyArray<Goal>) => Promise<ReadonlyArray<GoalResult>>;
export declare const allMet: (results: ReadonlyArray<GoalResult>) => boolean;
export {};
