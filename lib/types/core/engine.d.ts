import type { Computed } from "./compute.ts";
import type { WorkbookState } from "./workbook.ts";
/**
 * Computes every formula of the workbook with the Univer formula engine, without a page.
 * The same engine computes the table the student sees, so the results match.
 */
export declare const computeNow: (workbook: WorkbookState) => Promise<Computed>;
