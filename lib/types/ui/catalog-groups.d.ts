import { type Scenario, type ScenarioTopic } from "../scenarios/types.ts";
/** Exercises of one grade, in library order, and how many of them are solved. */
export interface GradeGroup {
    readonly grade: number;
    readonly items: ReadonlyArray<Scenario>;
    readonly done: number;
}
/** Exercises grouped by grade, grades ascending; `solved` gives the count of each group. */
export declare const gradeGroups: (scenarios: ReadonlyArray<Scenario>, solved: ReadonlyArray<string>) => ReadonlyArray<GradeGroup>;
/** The topic of an exercise: the catalog puts one without a topic under the first formulas. */
export declare const topicOf: (scenario: Scenario) => ScenarioTopic;
export declare const topicName: (scenario: Scenario) => string;
/** Text of the catalog card: the summary, or the first step of the task. */
export declare const summaryOf: (scenario: Scenario) => string;
/**
 * The exercise to open after `current`: the next unsolved one in library order, starting after `current` and going
 * round to the start; `undefined` when every other exercise is solved.
 */
export declare const nextScenario: (scenarios: ReadonlyArray<Scenario>, solved: ReadonlyArray<string>, current: string) => Scenario | undefined;
