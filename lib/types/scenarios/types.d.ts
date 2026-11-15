import type { Goal } from "../core/goals.ts";
import type { SheetSpec } from "../core/workbook.ts";
/** The skill an exercise trains: the catalog groups exercises of one grade by it. */
export type ScenarioTopic = "formulas" | "format" | "functions" | "references" | "logic" | "data";
/** Topic names as the student reads them, in the order the catalog shows them. */
export declare const TOPIC_NAMES: Readonly<Record<ScenarioTopic, string>>;
/** What a guide step points at: a ribbon button by its command, cells of the sheet or a ribbon tab by its name. */
export type GuideTarget = {
    readonly command: string;
} | {
    readonly cells: string;
} | {
    readonly tab: string;
};
/**
 * When a guide step is done: a command ran (a button was pressed), the selection is exactly these cells, a ribbon
 * tab is open, or a condition on the table is met (the same conditions as the goals).
 */
export type GuideDone = {
    readonly command: string;
} | {
    readonly select: string;
} | {
    readonly tab: string;
} | {
    readonly goal: Goal;
};
/** One step of a guide: the student reads `text`, sees `target` lit while the rest is shaded, and does it. */
export interface GuideStep {
    readonly text: string;
    readonly target?: GuideTarget;
    /**
     * Ribbon commands the student may use in this step, besides the target and undo/redo: exact ids or prefixes that end
     * with `*` (`"sheet.command.numfmt.*"`). Every other button is grey and its shortcut does nothing.
     */
    readonly open?: ReadonlyArray<string>;
    readonly done: GuideDone;
}
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
    /**
     * Step-by-step help: while it runs, only the buttons of the current step work and the step's target is lit. The
     * student can turn it off and solve the task freely; the goals are checked either way.
     */
    readonly guide?: ReadonlyArray<GuideStep>;
}
