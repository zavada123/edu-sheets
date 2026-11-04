import type { Goal } from "../core/goals.ts";
import type { SheetSpec } from "../core/workbook.ts";
/** The skill an exercise trains: the catalog groups exercises of one grade by it. */
export type ScenarioTopic = "formulas" | "format" | "functions" | "references" | "logic" | "data";
/** Topic names as the student reads them, in the order the catalog shows them. */
export declare const TOPIC_NAMES: Readonly<Record<ScenarioTopic, string>>;
/** One exercise: what is in the table at the start, what to do, and how to check it. */
export interface Scenario {
    readonly id: string;
    /** School grade shown on the task card; 0 hides it (a page that shows the grade itself). */
    readonly grade: number;
    readonly title: string;
    /** The task as the student reads it. Short sentences, one action each. */
    readonly task: ReadonlyArray<string>;
    /** Sheets at the start; an empty list gives one empty «Аркуш1». */
    readonly start: ReadonlyArray<SheetSpec>;
    readonly goals: ReadonlyArray<Goal>;
    /** What the exercise trains; the catalog puts an exercise without one under «Формули». */
    readonly topic?: ScenarioTopic;
    /** One line for the catalog card: the situation of the exercise. */
    readonly summary?: string;
    /** Short tags for the catalog card: functions and actions the exercise uses. */
    readonly skills?: ReadonlyArray<string>;
}
