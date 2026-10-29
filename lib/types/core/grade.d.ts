import { type GoalResult } from "./goals.ts";
import type { Scenario } from "../scenarios/types.ts";
export type Grade = {
    readonly status: "checked";
    readonly solved: boolean;
    readonly results: ReadonlyArray<GoalResult>;
}
/** The answer is not a workbook, or is larger than `LIMITS`. */
 | {
    readonly status: "invalid";
};
/**
 * Grades a handed-in workbook on the server: every formula is computed again here,
 * so values sent by the page are never trusted.
 */
export declare const grade: (scenario: Scenario, answer: unknown) => Promise<Grade>;
